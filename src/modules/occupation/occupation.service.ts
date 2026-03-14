import { Injectable } from '@nestjs/common';

import { OccupationRepository } from './occupation.repository';
import type { CreateOccupationDTO, Occupation, UpdateOccupationDTO } from './occupation.model';

@Injectable()
export class OccupationService {
  constructor(private readonly repository: OccupationRepository) {}

  async createOccupation(data: CreateOccupationDTO): Promise<Occupation> {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error('An occupation with this name already exists');
    }

    return await this.repository.create(data);
  }

  async getOccupationById(id: number): Promise<Occupation | null> {
    return await this.repository.findById(id);
  }

  async getAllOccupations(filters?: {
    collectsResources?: boolean;
    participatesInExpeditions?: boolean;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Occupation[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      collectsResources?: boolean;
      participatesInExpeditions?: boolean;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.collectsResources !== undefined) {
      repoFilters.collectsResources = filters.collectsResources;
    }

    if (filters?.participatesInExpeditions !== undefined) {
      repoFilters.participatesInExpeditions = filters.participatesInExpeditions;
    }

    if (filters?.resourceTypeId !== undefined) {
      repoFilters.resourceTypeId = filters.resourceTypeId;
    }

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateOccupation(id: number, data: UpdateOccupationDTO): Promise<Occupation | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.name && data.name !== existing.name) {
      const byName = await this.repository.findByName(data.name);
      if (byName && byName.id !== id) {
        throw new Error('Another occupation with this name already exists');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteOccupation(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
