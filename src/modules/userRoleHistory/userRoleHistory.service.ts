import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      const result = await this.repository.createEntryTransactional(data);
      return result.createdEntry;
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (message === 'USER_NOT_FOUND') {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (message === 'CHANGED_BY_NOT_FOUND') {
        throw new NotFoundException('Usuario que cambio el rol no encontrado');
      }

      if (message === 'PREVIOUS_ROLE_MISMATCH') {
        throw new BadRequestException('previousRole no coincide con el rol actual del usuario');
      }

      throw error;
    }
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
