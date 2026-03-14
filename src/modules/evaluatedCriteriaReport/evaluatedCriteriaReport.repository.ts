import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EvaluatedCriteriaReportEntity } from './evaluatedCriteriaReport.entity';
import type {
  CreateEvaluatedCriteriaReportDTO,
  EvaluatedCriteriaReport,
  UpdateEvaluatedCriteriaReportDTO,
} from './evaluatedCriteriaReport.model';

@Injectable()
export class EvaluatedCriteriaReportRepository {
  constructor(
    @InjectRepository(EvaluatedCriteriaReportEntity)
    private readonly repo: Repository<EvaluatedCriteriaReportEntity>,
  ) {}

  async create(data: CreateEvaluatedCriteriaReportDTO): Promise<EvaluatedCriteriaReport> {
    const entity = this.repo.create({
      reportId: data.reportId,
      criteriaId: data.criteriaId,
      evaluatedValue: data.evaluatedValue,
      scoreObtained: data.scoreObtained ?? null,
      observation: data.observation ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<EvaluatedCriteriaReport | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByReportAndCriteria(
    reportId: number,
    criteriaId: number,
  ): Promise<EvaluatedCriteriaReport | null> {
    return await this.repo.findOne({ where: { reportId, criteriaId } });
  }

  async findAllAndCount(filters?: {
    reportId?: number;
    criteriaId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: EvaluatedCriteriaReport[]; total: number }> {
    const qb = this.repo.createQueryBuilder('ev');

    if (filters?.reportId !== undefined) {
      qb.andWhere('ev.reportId = :reportId', { reportId: filters.reportId });
    }

    if (filters?.criteriaId !== undefined) {
      qb.andWhere('ev.criteriaId = :criteriaId', { criteriaId: filters.criteriaId });
    }

    qb.orderBy('ev.id', 'DESC');

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
    data: UpdateEvaluatedCriteriaReportDTO,
  ): Promise<EvaluatedCriteriaReport | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<EvaluatedCriteriaReportEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
