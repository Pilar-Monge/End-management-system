import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleHistoryEntity } from './userRoleHistory.entity';
import type {
  CreateUserRoleHistoryDTO,
  UpdateUserRoleHistoryDTO,
  UserRoleHistory,
} from './userRoleHistory.model';

@Injectable()
export class UserRoleHistoryRepository {
  constructor(
    @InjectRepository(UserRoleHistoryEntity)
    private readonly repo: Repository<UserRoleHistoryEntity>,
  ) {}

  async create(data: CreateUserRoleHistoryDTO): Promise<UserRoleHistory> {
    const entity = this.repo.create({
      userId: data.userId,
      previousRole: data.previousRole,
      newRole: data.newRole,
      changedBy: data.changedBy,
      ...(data.changeDate !== undefined ? { changeDate: data.changeDate } : {}),
      reason: data.reason ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<UserRoleHistory | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    userId?: number;
    changedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: UserRoleHistory[]; total: number }> {
    const qb = this.repo.createQueryBuilder('h');

    if (filters?.userId !== undefined) {
      qb.andWhere('h.userId = :userId', { userId: filters.userId });
    }

    if (filters?.changedBy !== undefined) {
      qb.andWhere('h.changedBy = :changedBy', { changedBy: filters.changedBy });
    }

    qb.orderBy('h.changeDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(
    id: number,
    data: UpdateUserRoleHistoryDTO,
  ): Promise<UserRoleHistory | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<UserRoleHistoryEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
