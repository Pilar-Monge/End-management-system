import { Injectable } from '@nestjs/common';

import { TemporaryOccupationAssignmentRepository } from './temporaryOccupationAssignment.repository';
import type {
  CreateTemporaryOccupationAssignmentDTO,
  TemporaryOccupationAssignment,
  UpdateTemporaryOccupationAssignmentDTO,
} from './temporaryOccupationAssignment.model';

@Injectable()
export class TemporaryOccupationAssignmentService {
  constructor(private readonly repository: TemporaryOccupationAssignmentRepository) {}

  async createAssignment(
    data: CreateTemporaryOccupationAssignmentDTO,
  ): Promise<TemporaryOccupationAssignment> {
    return await this.repository.create(data);
  }

  async getAssignmentById(id: number): Promise<TemporaryOccupationAssignment | null> {
    return await this.repository.findById(id);
  }

  async getAllAssignments(filters?: {
    personId?: number;
    temporaryOccupationId?: number;
    assignedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: TemporaryOccupationAssignment[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      personId?: number;
      temporaryOccupationId?: number;
      assignedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.temporaryOccupationId !== undefined) {
      repoFilters.temporaryOccupationId = filters.temporaryOccupationId;
    }
    if (filters?.assignedBy !== undefined) repoFilters.assignedBy = filters.assignedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateAssignment(
    id: number,
    data: UpdateTemporaryOccupationAssignmentDTO,
  ): Promise<TemporaryOccupationAssignment | null> {
    return await this.repository.update(id, data);
  }

  async deleteAssignment(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
