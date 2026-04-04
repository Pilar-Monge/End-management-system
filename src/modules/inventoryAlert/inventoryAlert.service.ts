import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
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

    return await this.repository.create(data);
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

    return await this.repository.update(id, data);
  }

  async deleteAlert(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
