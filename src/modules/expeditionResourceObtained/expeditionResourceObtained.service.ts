import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationService } from '../notification/notification.service';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { ExpeditionResourceObtainedRepository } from './expeditionResourceObtained.repository';
import type {
  CreateExpeditionResourceObtainedDTO,
  ExpeditionResourceObtained,
  UpdateExpeditionResourceObtainedDTO,
} from './expeditionResourceObtained.model';

@Injectable()
export class ExpeditionResourceObtainedService {
  constructor(
    private readonly repository: ExpeditionResourceObtainedRepository,
    private readonly dataSource: DataSource,
    @InjectRepository(ExpeditionEntity)
    private readonly expeditionRepo: Repository<ExpeditionEntity>,
    @InjectRepository(InventoryMovementEntity)
    private readonly movementRepo: Repository<InventoryMovementEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  private async validateRecorder(
    expeditionId: number,
    recordedBy: number,
    resourceTypeId: number,
    movementId?: number | null,
  ): Promise<void> {
    await assertEntityExists(this.dataSource, ResourceTypeEntity, resourceTypeId, 'Resource type');

    const expedition = await this.expeditionRepo.findOne({ where: { id: expeditionId } });
    if (!expedition) {
      throw new NotFoundException('Expedition not found');
    }

    const user = await this.userRepo.findOne({ where: { id: recordedBy } });
    if (!user) {
      throw new NotFoundException('RecordedBy user not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Only ACTIVE users can record obtained expedition resources');
    }

    if (user.role !== 'RESOURCE_MANAGEMENT' && user.role !== 'SYSTEM_ADMIN') {
      throw new ForbiddenException(
        'Only RESOURCE_MANAGEMENT or SYSTEM_ADMIN can record obtained expedition resources',
      );
    }

    if (user.campId !== expedition.campId) {
      throw new BadRequestException('RecordedBy user does not belong to expedition camp');
    }

    if (movementId === null || movementId === undefined) {
      return;
    }

    const movement = await this.movementRepo.findOne({ where: { id: movementId } });
    if (!movement) {
      throw new NotFoundException('Movement not found');
    }

    if (movement.campId !== expedition.campId) {
      throw new BadRequestException('Movement does not belong to expedition camp');
    }

    if (movement.resourceTypeId !== resourceTypeId) {
      throw new BadRequestException(
        'Movement resource type does not match provided resourceTypeId',
      );
    }
  }

  async createRecord(
    data: CreateExpeditionResourceObtainedDTO,
  ): Promise<ExpeditionResourceObtained> {
    await this.validateRecorder(
      data.expeditionId,
      data.recordedBy,
      data.resourceTypeId,
      data.movementId,
    );

    const existing = await this.repository.findByExpeditionAndResourceType(
      data.expeditionId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This obtained resource record already exists for this expedition');
    }

    const created = await this.repository.create(data);
    const expedition = await this.expeditionRepo.findOne({ where: { id: data.expeditionId } });

    if (expedition) {
      await this.notificationService.notifyCampRoles(
        expedition.campId,
        ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN', 'TRAVEL_MANAGER'],
        {
          type: 'EXPEDITION_RESOURCE_OBTAINED',
          title: 'Expedition resource obtained',
          message: `Obtained resource ${data.resourceTypeId} of amount ${data.amount} was recorded in expedition ${data.expeditionId}.`,
          sourceType: 'expedition_resource_obtained',
          sourceId: created.id,
        },
      );
    }

    return created;
  }

  async getRecordById(id: number): Promise<ExpeditionResourceObtained | null> {
    return await this.repository.findById(id);
  }

  async getAllRecords(filters?: {
    expeditionId?: number;
    resourceTypeId?: number;
    recordedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: ExpeditionResourceObtained[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      expeditionId?: number;
      resourceTypeId?: number;
      recordedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.expeditionId !== undefined) repoFilters.expeditionId = filters.expeditionId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.recordedBy !== undefined) repoFilters.recordedBy = filters.recordedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRecord(
    id: number,
    data: UpdateExpeditionResourceObtainedDTO,
  ): Promise<ExpeditionResourceObtained | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const expeditionId = data.expeditionId ?? existing.expeditionId;
    const recordedBy = data.recordedBy ?? existing.recordedBy;
    const resourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;
    const movementId = data.movementId !== undefined ? data.movementId : existing.movementId;
    await this.validateRecorder(expeditionId, recordedBy, resourceTypeId, movementId);

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    const expedition = await this.expeditionRepo.findOne({ where: { id: updated.expeditionId } });
    if (expedition) {
      await this.notificationService.notifyCampRoles(
        expedition.campId,
        ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN', 'TRAVEL_MANAGER'],
        {
          type: 'EXPEDITION_RESOURCE_OBTAINED',
          title: 'Expedition resource obtained updated',
          message: `Obtained resource record ${updated.resourceTypeId} in expedition ${updated.expeditionId} was updated.`,
          sourceType: 'expedition_resource_obtained',
          sourceId: updated.id,
        },
      );
    }

    return updated;
  }

  async deleteRecord(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    const expedition = await this.expeditionRepo.findOne({ where: { id: existing.expeditionId } });
    if (expedition) {
      await this.notificationService.notifyCampRoles(
        expedition.campId,
        ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN', 'TRAVEL_MANAGER'],
        {
          type: 'EXPEDITION_RESOURCE_OBTAINED',
          title: 'Obtained resource record deleted',
          message: `An obtained resource record was deleted from expedition ${existing.expeditionId}.`,
          sourceType: 'expedition_resource_obtained',
          sourceId: existing.id,
        },
      );
    }

    return true;
  }
}
