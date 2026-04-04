import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { UserEntity } from '../systemUser/systemUser.entity';

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
    private readonly dataSource: DataSource,
  ) {}

  async createMovement(data: CreateInventoryMovementDTO): Promise<InventoryMovement> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );
    await assertEntityExists(this.dataSource, UserEntity, data.recordedBy, 'User');

    return await this.repository.create(data);
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
