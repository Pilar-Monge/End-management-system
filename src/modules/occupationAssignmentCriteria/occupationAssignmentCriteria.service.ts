import { Injectable } from '@nestjs/common';

import { OccupationAssignmentCriteriaRepository } from './occupationAssignmentCriteria.repository';
import type {
  CreateOccupationAssignmentCriteriaDTO,
  OccupationAssignmentCriteria,
  OccupationCriteriaEvaluatedField,
  UpdateOccupationAssignmentCriteriaDTO,
} from './occupationAssignmentCriteria.model';

@Injectable()
export class OccupationAssignmentCriteriaService {
  constructor(
    private readonly repository: OccupationAssignmentCriteriaRepository,
  ) {}

  async createCriteria(
    data: CreateOccupationAssignmentCriteriaDTO,
  ): Promise<OccupationAssignmentCriteria> {
    return await this.repository.create(data);
  }

  async getCriteriaById(id: number): Promise<OccupationAssignmentCriteria | null> {
    return await this.repository.findById(id);
  }

  async getAllCriteria(filters?: {
    occupationId?: number;
    evaluatedField?: OccupationCriteriaEvaluatedField;
    active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: OccupationAssignmentCriteria[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      occupationId?: number;
      evaluatedField?: OccupationCriteriaEvaluatedField;
      active?: boolean;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.occupationId !== undefined) repoFilters.occupationId = filters.occupationId;
    if (filters?.evaluatedField !== undefined) repoFilters.evaluatedField = filters.evaluatedField;
    if (filters?.active !== undefined) repoFilters.active = filters.active;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateCriteria(
    id: number,
    data: UpdateOccupationAssignmentCriteriaDTO,
  ): Promise<OccupationAssignmentCriteria | null> {
    return await this.repository.update(id, data);
  }

  async deleteCriteria(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
