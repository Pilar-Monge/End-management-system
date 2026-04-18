import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UserEntity } from '../systemUser/systemUser.entity';
import { UserRoleHistoryEntity } from './userRoleHistory.entity';
import { UserRoleHistoryRepository } from './userRoleHistory.repository';
import type {
  CreateUserRoleHistoryDTO,
  UserRoleHistory,
  UpdateUserRoleHistoryDTO,
} from './userRoleHistory.model';

@Injectable()
export class UserRoleHistoryService {
  constructor(
    private readonly repository: UserRoleHistoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createEntry(data: CreateUserRoleHistoryDTO): Promise<UserRoleHistory> {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserEntity);
      const historyRepo = manager.getRepository(UserRoleHistoryEntity);

      const targetUser = await userRepo.findOne({ where: { id: data.userId } });
      if (!targetUser) {
        throw new NotFoundException('User not found');
      }

      const changedByUser = await userRepo.findOne({ where: { id: data.changedBy } });
      if (!changedByUser) {
        throw new NotFoundException('User who changed role not found');
      }

      if (targetUser.role !== data.previousRole) {
        throw new BadRequestException('previousRole does not match current user role');
      }

      targetUser.role = data.newRole;
      await userRepo.save(targetUser);

      const historyEntry = historyRepo.create({
        userId: data.userId,
        previousRole: data.previousRole,
        newRole: data.newRole,
        changedBy: data.changedBy,
        ...(data.changeDate !== undefined ? { changeDate: data.changeDate } : {}),
        reason: data.reason ?? null,
      });

      return await historyRepo.save(historyEntry);
    });
  }

  async getEntryById(id: number): Promise<UserRoleHistory | null> {
    return await this.repository.findById(id);
  }

  async getEntryCampId(id: number): Promise<number | null> {
    const entry = await this.repository.findById(id);
    if (!entry) {
      return null;
    }

    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: entry.userId },
      select: {
        campId: true,
      },
    });

    return user?.campId ?? null;
  }

  async getUserCampId(userId: number): Promise<number | null> {
    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: userId },
      select: {
        campId: true,
      },
    });

    return user?.campId ?? null;
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
