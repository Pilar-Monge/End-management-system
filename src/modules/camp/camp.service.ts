import { Injectable } from '@nestjs/common';

import { CampRepository } from './camp.repository';
import type { Camp, CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';

@Injectable()
export class CampService {
  constructor(private readonly repository: CampRepository) {}

  async createCamp(data: CreateCampDTO): Promise<Camp> {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error('A camp with this name already exists');
    }

    return await this.repository.create(data);
  }

  async getCampById(id: number): Promise<Camp | null> {
    return await this.repository.findById(id);
  }

  async getAllCamps(filters?: {
    status?: CampStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Camp[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      status?: CampStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateCamp(id: number, data: UpdateCampDTO): Promise<Camp | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.name && data.name !== existing.name) {
      const byName = await this.repository.findByName(data.name);
      if (byName && byName.id !== id) {
        throw new Error('Another camp with this name already exists');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteCamp(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
