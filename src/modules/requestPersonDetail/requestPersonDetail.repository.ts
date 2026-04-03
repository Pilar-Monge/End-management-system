import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestPersonDetailEntity } from './requestPersonDetail.entity';
import type {
  CreateRequestPersonDetailDTO,
  PersonDetailStatus,
  PersonDetailType,
  RequestPersonDetail,
  UpdateRequestPersonDetailDTO,
} from './requestPersonDetail.model';

@Injectable()
export class RequestPersonDetailRepository {
  constructor(
    @InjectRepository(RequestPersonDetailEntity)
    private readonly repo: Repository<RequestPersonDetailEntity>,
  ) {}

  async create(data: CreateRequestPersonDetailDTO): Promise<RequestPersonDetail> {
    const entity = this.repo.create({
      requestId: data.requestId,
      detailType: data.detailType ?? 'BY_OCCUPATION',
      personId: data.personId ?? null,
      occupationId: data.occupationId ?? null,
      amount: data.amount ?? 1,
      status: data.status ?? 'PROPOSED',
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<RequestPersonDetail | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    requestId?: number;
    detailType?: PersonDetailType;
    status?: PersonDetailStatus;
    personId?: number;
    occupationId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: RequestPersonDetail[]; total: number }> {
    const qb = this.repo.createQueryBuilder('d');

    if (filters?.requestId !== undefined) {
      qb.andWhere('d.requestId = :requestId', { requestId: filters.requestId });
    }

    if (filters?.detailType !== undefined) {
      qb.andWhere('d.detailType = :detailType', { detailType: filters.detailType });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('d.status = :status', { status: filters.status });
    }

    if (filters?.personId !== undefined) {
      qb.andWhere('d.personId = :personId', { personId: filters.personId });
    }

    if (filters?.occupationId !== undefined) {
      qb.andWhere('d.occupationId = :occupationId', {
        occupationId: filters.occupationId,
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
    data: UpdateRequestPersonDetailDTO,
  ): Promise<RequestPersonDetail | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<RequestPersonDetailEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
