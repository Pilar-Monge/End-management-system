import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationService } from '../notification/notification.service';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { InventoryAlertRepository } from './inventoryAlert.repository';
import type {
  CreateInventoryAlertDTO,
  InventoryAlert,
  UpdateInventoryAlertDTO,
} from './inventoryAlert.model';

@Injectable()
export class InventoryAlertService {
  constructor(
    private readonly repository: InventoryAlertRepository,
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  async createAlert(data: CreateInventoryAlertDTO): Promise<InventoryAlert> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );
    if (data.movementId !== undefined && data.movementId !== null) {
      await assertEntityExists(
        this.dataSource,
        InventoryMovementEntity,
        data.movementId,
        'Inventory movement',
      );
    }

    const created = await this.repository.create(data);
    await this.notificationService.notifyCampRoles(
      created.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: 'Nueva alerta de inventario',
        message: `Se registro una alerta de inventario para recurso ${created.resourceTypeId}.`,
        sourceType: 'inventory_alert',
        sourceId: created.id,
      },
    );

    return created;
  }

  async getAlertById(id: number): Promise<InventoryAlert | null> {
    return await this.repository.findById(id);
  }

  async getAllAlerts(filters?: {
    campId?: number;
    resourceTypeId?: number;
    resolved?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: InventoryAlert[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      resourceTypeId?: number;
      resolved?: boolean;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.resolved !== undefined) repoFilters.resolved = filters.resolved;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateAlert(id: number, data: UpdateInventoryAlertDTO): Promise<InventoryAlert | null> {
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
    if (data.movementId !== undefined && data.movementId !== null) {
      await assertEntityExists(
        this.dataSource,
        InventoryMovementEntity,
        data.movementId,
        'Inventory movement',
      );
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    await this.notificationService.notifyCampRoles(
      updated.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: updated.resolved
          ? 'Alerta de inventario resuelta'
          : 'Alerta de inventario actualizada',
        message: updated.resolved
          ? `La alerta ${updated.id} se marco como resuelta.`
          : `La alerta ${updated.id} fue actualizada.`,
        sourceType: 'inventory_alert',
        sourceId: updated.id,
      },
    );

    return updated;
  }

  async deleteAlert(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notificationService.notifyCampRoles(
      existing.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: 'Alerta de inventario eliminada',
        message: `La alerta ${existing.id} fue eliminada del sistema.`,
        sourceType: 'inventory_alert',
        sourceId: existing.id,
      },
    );

    return true;
  }
}
