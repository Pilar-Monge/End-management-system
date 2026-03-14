import { Injectable } from '@nestjs/common';

import { UserRoleHistoryRepository } from './userRoleHistory.repository';
import type {
  CreateUserRoleHistoryDTO,
  UserRoleHistory,
  UpdateUserRoleHistoryDTO,
} from './userRoleHistory.model';

@Injectable()
export class UserRoleHistoryService {
  constructor(private readonly repository: UserRoleHistoryRepository) {}

  async createEntry(data: CreateUserRoleHistoryDTO): Promise<UserRoleHistory> {
    return await this.repository.create(data);
  }

  async getEntryById(id: number): Promise<UserRoleHistory | null> {
    return await this.repository.findById(id);
  }

  async getAllEntries(filters?: {
    userId?: number;
    changedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: UserRoleHistory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      userId?: number;
      changedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.userId !== undefined) repoFilters.userId = filters.userId;
    if (filters?.changedBy !== undefined) repoFilters.changedBy = filters.changedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateEntry(id: number, data: UpdateUserRoleHistoryDTO): Promise<UserRoleHistory | null> {
    return await this.repository.update(id, data);
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
