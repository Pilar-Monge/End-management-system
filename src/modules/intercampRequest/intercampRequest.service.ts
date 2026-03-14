import { Injectable } from '@nestjs/common';

import { IntercampRequestRepository } from './intercampRequest.repository';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

@Injectable()
export class IntercampRequestService {
  constructor(private readonly repository: IntercampRequestRepository) {}

  async createRequest(data: CreateIntercampRequestDTO): Promise<IntercampRequest> {
    return await this.repository.create(data);
  }

  async getRequestById(id: number): Promise<IntercampRequest | null> {
    return await this.repository.findById(id);
  }

  async getAllRequests(filters?: {
    originCampId?: number;
    destinationCampId?: number;
    status?: IntercampRequestStatus;
    createdBy?: number;
    respondedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: IntercampRequest[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      originCampId?: number;
      destinationCampId?: number;
      status?: IntercampRequestStatus;
      createdBy?: number;
      respondedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.originCampId !== undefined) repoFilters.originCampId = filters.originCampId;
    if (filters?.destinationCampId !== undefined)
      repoFilters.destinationCampId = filters.destinationCampId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;
    if (filters?.createdBy !== undefined) repoFilters.createdBy = filters.createdBy;
    if (filters?.respondedBy !== undefined) repoFilters.respondedBy = filters.respondedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRequest(id: number, data: UpdateIntercampRequestDTO): Promise<IntercampRequest | null> {
    return await this.repository.update(id, data);
  }

  async deleteRequest(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
