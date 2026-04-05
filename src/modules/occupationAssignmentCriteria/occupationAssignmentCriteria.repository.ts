import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OccupationAssignmentCriteriaEntity } from './occupationAssignmentCriteria.entity';
import type {
  CreateOccupationAssignmentCriteriaDTO,
  OccupationAssignmentCriteria,
  OccupationCriteriaEvaluatedField,
  UpdateOccupationAssignmentCriteriaDTO,
} from './occupationAssignmentCriteria.model';

@Injectable()
export class OccupationAssignmentCriteriaRepository {
  constructor(
    @InjectRepository(OccupationAssignmentCriteriaEntity)
    private readonly repo: Repository<OccupationAssignmentCriteriaEntity>,
  ) {}

  async create(data: CreateOccupationAssignmentCriteriaDTO): Promise<OccupationAssignmentCriteria> {
    const entity = this.repo.create({
      occupationId: data.occupationId,
      criteriaDescription: data.criteriaDescription,
      evaluatedField: data.evaluatedField,
      weight: data.weight !== undefined ? String(data.weight) : '1.00',
      active: data.active ?? true,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<OccupationAssignmentCriteria | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    occupationId?: number;
    evaluatedField?: OccupationCriteriaEvaluatedField;
    active?: boolean;
    offset?: number;
    limit?: number;
  }): Promise<{ data: OccupationAssignmentCriteria[]; total: number }> {
    const qb = this.repo.createQueryBuilder('c');

    if (filters?.occupationId !== undefined) {
      qb.andWhere('c.occupationId = :occupationId', { occupationId: filters.occupationId });
    }

    if (filters?.evaluatedField !== undefined) {
      qb.andWhere('c.evaluatedField = :evaluatedField', { evaluatedField: filters.evaluatedField });
    }

    if (filters?.active !== undefined) {
      qb.andWhere('c.active = :active', { active: filters.active });
    }

    qb.orderBy('c.createdAt', 'DESC');

    if (filters?.limit !== undefined) qb.take(filters.limit);
    if (filters?.offset !== undefined) qb.skip(filters.offset);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(
    id: number,
    data: UpdateOccupationAssignmentCriteriaDTO,
  ): Promise<OccupationAssignmentCriteria | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<OccupationAssignmentCriteriaEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
