import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TemporaryOccupationAssignmentEntity } from './temporaryOccupationAssignment.entity';
import type {
  CreateTemporaryOccupationAssignmentDTO,
  TemporaryOccupationAssignment,
  UpdateTemporaryOccupationAssignmentDTO,
} from './temporaryOccupationAssignment.model';

@Injectable()
export class TemporaryOccupationAssignmentRepository {
  constructor(
    @InjectRepository(TemporaryOccupationAssignmentEntity)
    private readonly repo: Repository<TemporaryOccupationAssignmentEntity>,
  ) {}

  async create(
    data: CreateTemporaryOccupationAssignmentDTO,
  ): Promise<TemporaryOccupationAssignment> {
    const entity = this.repo.create({
      personId: data.personId,
      temporaryOccupationId: data.temporaryOccupationId,
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      endDate: data.endDate ?? null,
      reason: data.reason,
      assignedBy: data.assignedBy,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<TemporaryOccupationAssignment | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    personId?: number;
    temporaryOccupationId?: number;
    assignedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: TemporaryOccupationAssignment[]; total: number }> {
    const qb = this.repo.createQueryBuilder('a');

    if (filters?.personId !== undefined) {
      qb.andWhere('a.personId = :personId', { personId: filters.personId });
    }

    if (filters?.temporaryOccupationId !== undefined) {
      qb.andWhere('a.temporaryOccupationId = :temporaryOccupationId', {
        temporaryOccupationId: filters.temporaryOccupationId,
      });
    }

    if (filters?.assignedBy !== undefined) {
      qb.andWhere('a.assignedBy = :assignedBy', { assignedBy: filters.assignedBy });
    }

    qb.orderBy('a.startDate', 'DESC');

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
    data: UpdateTemporaryOccupationAssignmentDTO,
  ): Promise<TemporaryOccupationAssignment | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<TemporaryOccupationAssignmentEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
