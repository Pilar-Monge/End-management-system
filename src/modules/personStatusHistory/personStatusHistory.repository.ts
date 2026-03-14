import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PersonStatusHistoryEntity } from './personStatusHistory.entity';
import type {
  CreatePersonStatusHistoryDTO,
  PersonStatus,
  PersonStatusHistory,
  UpdatePersonStatusHistoryDTO,
} from './personStatusHistory.model';

@Injectable()
export class PersonStatusHistoryRepository {
  constructor(
    @InjectRepository(PersonStatusHistoryEntity)
    private readonly repo: Repository<PersonStatusHistoryEntity>,
  ) {}

  async create(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    const entity = this.repo.create({
      personId: data.personId,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      reason: data.reason ?? null,
      changedBy: data.changedBy,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<PersonStatusHistory | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    personId?: number;
    changedBy?: number;
    previousStatus?: PersonStatus;
    newStatus?: PersonStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: PersonStatusHistory[]; total: number }> {
    const qb = this.repo.createQueryBuilder('h');

    if (filters?.personId !== undefined) {
      qb.andWhere('h.personId = :personId', { personId: filters.personId });
    }

    if (filters?.changedBy !== undefined) {
      qb.andWhere('h.changedBy = :changedBy', { changedBy: filters.changedBy });
    }

    if (filters?.previousStatus !== undefined) {
      qb.andWhere('h.previousStatus = :previousStatus', {
        previousStatus: filters.previousStatus,
      });
    }

    if (filters?.newStatus !== undefined) {
      qb.andWhere('h.newStatus = :newStatus', {
        newStatus: filters.newStatus,
      });
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
    data: UpdatePersonStatusHistoryDTO,
  ): Promise<PersonStatusHistory | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<PersonStatusHistoryEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
