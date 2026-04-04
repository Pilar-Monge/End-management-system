import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { OccupationEntity } from '../occupation/occupation.entity';

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
    private readonly dataSource: DataSource,
  ) {}

  async createCriteria(
    data: CreateOccupationAssignmentCriteriaDTO,
  ): Promise<OccupationAssignmentCriteria> {
    await assertEntityExists(
      this.dataSource,
      OccupationEntity,
      data.occupationId,
      'Occupation',
    );

    const normalizedData = this.normalizeAndValidateWeight(data);
    return await this.repository.create(normalizedData);
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
    if (data.occupationId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        OccupationEntity,
        data.occupationId,
        'Occupation',
      );
    }

    const normalizedData = this.normalizeAndValidateWeight(data);
    return await this.repository.update(id, normalizedData);
  }

  async deleteCriteria(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  private normalizeAndValidateWeight<
    T extends CreateOccupationAssignmentCriteriaDTO | UpdateOccupationAssignmentCriteriaDTO,
  >(data: T): T {
    if (data.weight === undefined) {
      return data;
    }

    const parsedWeight = Number.parseFloat(String(data.weight));
    if (Number.isNaN(parsedWeight)) {
      throw new BadRequestException('weight must be a valid number');
    }

    if (parsedWeight < 0 || parsedWeight > 1) {
      throw new BadRequestException('weight must be between 0.00 and 1.00');
    }

    return {
      ...data,
      weight: parsedWeight.toFixed(2),
    } as T;
  }
}
