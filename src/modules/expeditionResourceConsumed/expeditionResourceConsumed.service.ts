import { Injectable } from '@nestjs/common';

import { ExpeditionResourceConsumedRepository } from './expeditionResourceConsumed.repository';
import type {
  CreateExpeditionResourceConsumedDTO,
  ExpeditionResourceConsumed,
  UpdateExpeditionResourceConsumedDTO,
} from './expeditionResourceConsumed.model';

@Injectable()
export class ExpeditionResourceConsumedService {
  constructor(private readonly repository: ExpeditionResourceConsumedRepository) {}

  async createRecord(
    data: CreateExpeditionResourceConsumedDTO,
  ): Promise<ExpeditionResourceConsumed> {
    const existing = await this.repository.findByExpeditionAndResourceType(
      data.expeditionId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This consumed resource record already exists for this expedition');
    }

    return await this.repository.create(data);
  }

  async getRecordById(id: number): Promise<ExpeditionResourceConsumed | null> {
    return await this.repository.findById(id);
  }

  async getAllRecords(filters?: {
    expeditionId?: number;
    resourceTypeId?: number;
    recordedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: ExpeditionResourceConsumed[]; total: number }> {
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
    data: UpdateExpeditionResourceConsumedDTO,
  ): Promise<ExpeditionResourceConsumed | null> {
    return await this.repository.update(id, data);
  }

  async deleteRecord(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
