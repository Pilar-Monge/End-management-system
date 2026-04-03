import { Injectable } from '@nestjs/common';

import { RequestPersonDetailRepository } from './requestPersonDetail.repository';
import type {
  CreateRequestPersonDetailDTO,
  PersonDetailStatus,
  PersonDetailType,
  RequestPersonDetail,
  UpdateRequestPersonDetailDTO,
} from './requestPersonDetail.model';

@Injectable()
export class RequestPersonDetailService {
  constructor(private readonly repository: RequestPersonDetailRepository) {}

  async createDetail(data: CreateRequestPersonDetailDTO): Promise<RequestPersonDetail> {
    return await this.repository.create(data);
  }

  async getDetailById(id: number): Promise<RequestPersonDetail | null> {
    return await this.repository.findById(id);
  }

  async getAllDetails(filters?: {
    requestId?: number;
    detailType?: PersonDetailType;
    status?: PersonDetailStatus;
    personId?: number;
    occupationId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: RequestPersonDetail[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      detailType?: PersonDetailType;
      status?: PersonDetailStatus;
      personId?: number;
      occupationId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.detailType !== undefined) repoFilters.detailType = filters.detailType;
    if (filters?.status !== undefined) repoFilters.status = filters.status;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.occupationId !== undefined) repoFilters.occupationId = filters.occupationId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateDetail(
    id: number,
    data: UpdateRequestPersonDetailDTO,
  ): Promise<RequestPersonDetail | null> {
    return await this.repository.update(id, data);
  }

  async deleteDetail(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
