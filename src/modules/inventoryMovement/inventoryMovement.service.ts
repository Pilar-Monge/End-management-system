import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { NotificationService } from '../notification/notification.service';
import { UserEntity } from '../systemUser/systemUser.entity';
import { SystemRole } from '../systemUser/systemUser.model';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { CampEntity } from '../camp/camp.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { InventoryMovementRepository } from './inventoryMovement.repository';
import type {
  CreateInventoryMovementDTO,
  InventoryMovement,
  InventoryMovementType,
  UpdateInventoryMovementDTO,
} from './inventoryMovement.model';

@Injectable()
export class InventoryMovementService {
  constructor(
    private readonly repository: InventoryMovementRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private isConsumptionMovement(type: InventoryMovementType): boolean {
    return type === 'DAILY_RATION' || type === 'EXPEDITION_DEPARTURE' || type === 'TRANSFER_SENT';
  }

  private async notifyLowInventory(
    campId: number,
    resourceTypeId: number,
    movementId: number,
  ): Promise<void> {
    const campInventoryRepo = this.dataSource.getRepository(CampInventoryEntity);
    const inventory = await campInventoryRepo.findOne({
      where: { campId, resourceTypeId },
    });

    if (!inventory) return;

    const currentAmount = Number.parseFloat(inventory.currentAmount);
    const minimumAlertAmount = Number.parseFloat(inventory.minimumAlertAmount);

    if (Number.isNaN(currentAmount) || Number.isNaN(minimumAlertAmount)) return;
    if (currentAmount > minimumAlertAmount) return;

    const userRepo = this.dataSource.getRepository(UserEntity);
    const alertRecipients = await userRepo.find({
      select: { id: true, role: true },
      where: {
        campId,
        role: In([SystemRole.RESOURCE_MANAGEMENT, SystemRole.SYSTEM_ADMIN]),
      },
    });

    if (alertRecipients.length === 0) return;

    for (const recipient of alertRecipients) {
      await this.notificationService.createNotification({
        campId,
        userId: recipient.id,
        type: 'INVENTORY_ALERT',
        title: 'Alerta de inventario bajo',
        message: `El recurso ${resourceTypeId} esta en o por debajo del minimo (${inventory.currentAmount} <= ${inventory.minimumAlertAmount}).`,
        sourceType: 'inventory_movement',
        sourceId: movementId,
      });
    }
  }

  async createMovement(data: CreateInventoryMovementDTO): Promise<InventoryMovement> {
    const amount = Number.parseFloat(`${data.amount}`);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );
    await assertEntityExists(this.dataSource, UserEntity, data.recordedBy, 'User');

    const movement = await this.repository.create(data);

    if (this.isConsumptionMovement(data.movementType)) {
      await this.notifyLowInventory(data.campId, data.resourceTypeId, movement.id);
    }

    return movement;
  }

  async getMovementById(id: number): Promise<InventoryMovement | null> {
    return await this.repository.findById(id);
  }

  async getAllMovements(filters?: {
    campId?: number;
    resourceTypeId?: number;
    movementType?: InventoryMovementType;
    recordedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: InventoryMovement[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      resourceTypeId?: number;
      movementType?: InventoryMovementType;
      recordedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.movementType !== undefined) repoFilters.movementType = filters.movementType;
    if (filters?.recordedBy !== undefined) repoFilters.recordedBy = filters.recordedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateMovement(
    id: number,
    data: UpdateInventoryMovementDTO,
  ): Promise<InventoryMovement | null> {
    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }
    if (data.resourceTypeId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        ResourceTypeEntity,
        data.resourceTypeId,
        'Resource type',
      );
    }
    if (data.recordedBy !== undefined) {
      await assertEntityExists(this.dataSource, UserEntity, data.recordedBy, 'User');
    }

    return await this.repository.update(id, data);
  }

  async deleteMovement(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
