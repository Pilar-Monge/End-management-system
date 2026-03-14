import { Injectable } from '@nestjs/common';

import { PersonStatusHistoryRepository } from './personStatusHistory.repository';
import type {
  CreatePersonStatusHistoryDTO,
  PersonStatus,
  PersonStatusHistory,
  UpdatePersonStatusHistoryDTO,
} from './personStatusHistory.model';

@Injectable()
export class PersonStatusHistoryService {
  constructor(private readonly repository: PersonStatusHistoryRepository) {}

  async createEntry(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    return await this.repository.create(data);
  }

  async getEntryById(id: number): Promise<PersonStatusHistory | null> {
    return await this.repository.findById(id);
  }

  async getAllEntries(filters?: {
    personId?: number;
    changedBy?: number;
    previousStatus?: PersonStatus;
    newStatus?: PersonStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: PersonStatusHistory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      personId?: number;
      changedBy?: number;
      previousStatus?: PersonStatus;
      newStatus?: PersonStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.changedBy !== undefined) repoFilters.changedBy = filters.changedBy;
    if (filters?.previousStatus !== undefined) repoFilters.previousStatus = filters.previousStatus;
    if (filters?.newStatus !== undefined) repoFilters.newStatus = filters.newStatus;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateEntry(id: number, data: UpdatePersonStatusHistoryDTO): Promise<PersonStatusHistory | null> {
    return await this.repository.update(id, data);
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
