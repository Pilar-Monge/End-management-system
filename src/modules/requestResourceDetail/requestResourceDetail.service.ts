import { Injectable } from '@nestjs/common';

import { RequestResourceDetailRepository } from './requestResourceDetail.repository';
import type {
  CreateRequestResourceDetailDTO,
  RequestResourceDetail,
  UpdateRequestResourceDetailDTO,
} from './requestResourceDetail.model';

@Injectable()
export class RequestResourceDetailService {
  constructor(private readonly repository: RequestResourceDetailRepository) {}

  async createDetail(data: CreateRequestResourceDetailDTO): Promise<RequestResourceDetail> {
    const existing = await this.repository.findByRequestAndResourceType(
      data.requestId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This request resource detail already exists');
    }

    return await this.repository.create(data);
  }

  async getDetailById(id: number): Promise<RequestResourceDetail | null> {
    return await this.repository.findById(id);
  }

  async getAllDetails(filters?: {
    requestId?: number;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: RequestResourceDetail[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateDetail(
    id: number,
    data: UpdateRequestResourceDetailDTO,
  ): Promise<RequestResourceDetail | null> {
    return await this.repository.update(id, data);
  }

  async deleteDetail(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
