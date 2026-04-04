import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { CampInventoryRepository } from './campInventory.repository';
import type {
  CampInventory,
  CreateCampInventoryDTO,
  UpdateCampInventoryDTO,
} from './campInventory.model';

@Injectable()
export class CampInventoryService {
  constructor(
    private readonly repository: CampInventoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createItem(data: CreateCampInventoryDTO): Promise<CampInventory> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );

    const existing = await this.repository.findByKey(data.campId, data.resourceTypeId);
    if (existing) {
      throw new Error('This camp inventory item already exists');
    }

    return await this.repository.create(data);
  }

  async getItem(campId: number, resourceTypeId: number): Promise<CampInventory | null> {
    return await this.repository.findByKey(campId, resourceTypeId);
  }

  async getAllItems(filters?: {
    campId?: number;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CampInventory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateItem(
    campId: number,
    resourceTypeId: number,
    data: UpdateCampInventoryDTO,
  ): Promise<CampInventory | null> {
    return await this.repository.update(campId, resourceTypeId, data);
  }

  async deleteItem(campId: number, resourceTypeId: number): Promise<boolean> {
    return await this.repository.delete(campId, resourceTypeId);
  }
}
