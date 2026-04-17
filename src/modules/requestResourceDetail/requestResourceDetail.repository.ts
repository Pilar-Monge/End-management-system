import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { RequestResourceDetailEntity } from './requestResourceDetail.entity';
import type {
  CreateRequestResourceDetailDTO,
  RequestResourceDetail,
  UpdateRequestResourceDetailDTO,
} from './requestResourceDetail.model';

@Injectable()
export class RequestResourceDetailRepository {
  constructor(
    @InjectRepository(RequestResourceDetailEntity)
    private readonly repo: Repository<RequestResourceDetailEntity>,
  ) {}

  async create(data: CreateRequestResourceDetailDTO): Promise<RequestResourceDetail> {
    const entity = this.repo.create({
      requestId: data.requestId,
      resourceTypeId: data.resourceTypeId,
      requestedAmount: data.requestedAmount,
      approvedAmount: data.approvedAmount ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<RequestResourceDetail | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  } | null> {
    const request = await this.repo.manager.getRepository(IntercampRequestEntity).findOne({
      where: { id: requestId },
      select: {
        originCampId: true,
        destinationCampId: true,
      },
    });

    if (!request) {
      return null;
    }

    return {
      originCampId: request.originCampId,
      destinationCampId: request.destinationCampId,
    };
  }

  async findByRequestAndResourceType(
    requestId: number,
    resourceTypeId: number,
  ): Promise<RequestResourceDetail | null> {
    return await this.repo.findOne({ where: { requestId, resourceTypeId } });
  }

  async findAllAndCount(filters?: {
    requestId?: number;
    resourceTypeId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: RequestResourceDetail[]; total: number }> {
    const qb = this.repo.createQueryBuilder('d');

    if (filters?.requestId !== undefined) {
      qb.andWhere('d.requestId = :requestId', { requestId: filters.requestId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('d.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    qb.orderBy('d.id', 'DESC');

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
    data: UpdateRequestResourceDetailDTO,
  ): Promise<RequestResourceDetail | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<RequestResourceDetailEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
