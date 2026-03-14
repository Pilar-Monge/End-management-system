import { Injectable } from '@nestjs/common';

import { ExpeditionResourceObtainedRepository } from './expeditionResourceObtained.repository';
import type {
  CreateExpeditionResourceObtainedDTO,
  ExpeditionResourceObtained,
  UpdateExpeditionResourceObtainedDTO,
} from './expeditionResourceObtained.model';

@Injectable()
export class ExpeditionResourceObtainedService {
  constructor(private readonly repository: ExpeditionResourceObtainedRepository) {}

  async createRecord(
    data: CreateExpeditionResourceObtainedDTO,
  ): Promise<ExpeditionResourceObtained> {
    const existing = await this.repository.findByExpeditionAndResourceType(
      data.expeditionId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This obtained resource record already exists for this expedition');
    }

    return await this.repository.create(data);
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
    return await this.repository.update(id, data);
  }

  async deleteRecord(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
