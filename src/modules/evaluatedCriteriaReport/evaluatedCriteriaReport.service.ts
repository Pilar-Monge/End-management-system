import { Injectable } from '@nestjs/common';

import { EvaluatedCriteriaReportRepository } from './evaluatedCriteriaReport.repository';
import type {
  CreateEvaluatedCriteriaReportDTO,
  EvaluatedCriteriaReport,
  UpdateEvaluatedCriteriaReportDTO,
} from './evaluatedCriteriaReport.model';

@Injectable()
export class EvaluatedCriteriaReportService {
  constructor(private readonly repository: EvaluatedCriteriaReportRepository) {}

  async createItem(data: CreateEvaluatedCriteriaReportDTO): Promise<EvaluatedCriteriaReport> {
    const existing = await this.repository.findByReportAndCriteria(data.reportId, data.criteriaId);
    if (existing) {
      throw new Error('This evaluated criteria report item already exists');
    }

    return await this.repository.create(data);
  }

  async getItemById(id: number): Promise<EvaluatedCriteriaReport | null> {
    return await this.repository.findById(id);
  }

  async getAllItems(filters?: {
    reportId?: number;
    criteriaId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: EvaluatedCriteriaReport[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      reportId?: number;
      criteriaId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.reportId !== undefined) repoFilters.reportId = filters.reportId;
    if (filters?.criteriaId !== undefined) repoFilters.criteriaId = filters.criteriaId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateItem(id: number, data: UpdateEvaluatedCriteriaReportDTO): Promise<EvaluatedCriteriaReport | null> {
    return await this.repository.update(id, data);
  }

  async deleteItem(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
