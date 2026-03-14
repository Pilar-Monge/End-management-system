import { Injectable } from '@nestjs/common';

import { ResourceTypeRepository } from './resourceType.repository';
import type {
  CreateResourceTypeDTO,
  ResourceCategory,
  ResourceType,
  UpdateResourceTypeDTO,
} from './resourceType.model';

@Injectable()
export class ResourceTypeService {
  constructor(private readonly repository: ResourceTypeRepository) {}

  async createResourceType(data: CreateResourceTypeDTO): Promise<ResourceType> {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error('A resource type with this name already exists');
    }

    return await this.repository.create(data);
  }

  async getResourceTypeById(id: number): Promise<ResourceType | null> {
    return await this.repository.findById(id);
  }

  async getAllResourceTypes(filters?: {
    category?: ResourceCategory;
    page?: number;
    limit?: number;
  }): Promise<{ data: ResourceType[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      category?: ResourceCategory;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.category !== undefined) repoFilters.category = filters.category;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateResourceType(id: number, data: UpdateResourceTypeDTO): Promise<ResourceType | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.name && data.name !== existing.name) {
      const byName = await this.repository.findByName(data.name);
      if (byName && byName.id !== id) {
        throw new Error('Another resource type with this name already exists');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteResourceType(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
