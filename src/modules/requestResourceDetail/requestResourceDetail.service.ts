import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { RequestResourceDetailRepository } from './requestResourceDetail.repository';
import type {
  CreateRequestResourceDetailDTO,
  RequestResourceDetail,
  UpdateRequestResourceDetailDTO,
} from './requestResourceDetail.model';

@Injectable()
export class RequestResourceDetailService {
  constructor(
    private readonly repository: RequestResourceDetailRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createDetail(data: CreateRequestResourceDetailDTO): Promise<RequestResourceDetail> {
    await assertEntityExists(
      this.dataSource,
      IntercampRequestEntity,
      data.requestId,
      'Intercamp request',
    );
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );

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
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const resolvedRequestId = data.requestId ?? existing.requestId;
    const resolvedResourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;

    if (data.requestId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        IntercampRequestEntity,
        resolvedRequestId,
        'Intercamp request',
      );
    }
    if (data.resourceTypeId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        ResourceTypeEntity,
        resolvedResourceTypeId,
        'Resource type',
      );
    }

    if (
      resolvedRequestId !== existing.requestId ||
      resolvedResourceTypeId !== existing.resourceTypeId
    ) {
      const byPair = await this.repository.findByRequestAndResourceType(
        resolvedRequestId,
        resolvedResourceTypeId,
      );
      if (byPair && byPair.id !== id) {
        throw new Error('This request resource detail already exists');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteDetail(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
