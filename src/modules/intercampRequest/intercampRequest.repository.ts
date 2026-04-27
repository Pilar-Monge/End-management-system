import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampEntity } from '../camp/camp.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { IntercampRequestEntity } from './intercampRequest.entity';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

@Injectable()
export class IntercampRequestRepository {
  constructor(
    @InjectRepository(IntercampRequestEntity)
    private readonly repo: Repository<IntercampRequestEntity>,
  ) {}

  async create(data: CreateIntercampRequestDTO): Promise<IntercampRequest> {
    const entity = this.repo.create({
      originCampId: data.originCampId,
      destinationCampId: data.destinationCampId,
      status: data.status ?? 'PENDING',
      description: data.description ?? null,
      ...(data.createdDate !== undefined ? { createdDate: data.createdDate } : {}),
      responseDate: data.responseDate ?? null,
      createdBy: data.createdBy,
      respondedBy: data.respondedBy ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<IntercampRequest | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findCampById(id: number): Promise<CampEntity | null> {
    return await this.repo.manager.getRepository(CampEntity).findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async countTransfersByRequestId(requestId: number): Promise<number> {
    const rows = (await this.repo.query(
      `SELECT COUNT(*)::int AS total FROM public.transfer WHERE request_id = $1`,
      [requestId],
    )) as Array<{ total: number }>;

    return rows[0]?.total ?? 0;
  }

  async countAppliedInventoryByRequestId(requestId: number): Promise<number> {
    const rows = (await this.repo.query(
      `SELECT COUNT(*)::int AS total
       FROM public.inventory_movement
       WHERE source_type = 'intercamp_request'
         AND source_id = $1
         AND movement_type IN ('TRANSFER_SENT', 'TRANSFER_RECEIVED')`,
      [requestId],
    )) as Array<{ total: number }>;

    return rows[0]?.total ?? 0;
  }

  async findRequestResourceAmountsByRequestId(
    requestId: number,
  ): Promise<Array<{ resourceTypeId: number; amount: string }>> {
    const rows = (await this.repo.query(
      `SELECT resource_type_id,
              COALESCE(approved_amount, requested_amount)::text AS amount
       FROM public.request_resource_detail
       WHERE request_id = $1
         AND COALESCE(approved_amount, requested_amount) > 0`,
      [requestId],
    )) as Array<{ resource_type_id: number; amount: string }>;

    return rows.map((row) => ({
      resourceTypeId: row.resource_type_id,
      amount: row.amount,
    }));
  }

  async findAllAndCount(filters?: {
    originCampId?: number;
    destinationCampId?: number;
    involvedCampId?: number;
    status?: IntercampRequestStatus;
    createdBy?: number;
    respondedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: IntercampRequest[]; total: number }> {
    const qb = this.repo.createQueryBuilder('r');

    if (filters?.originCampId !== undefined) {
      qb.andWhere('r.originCampId = :originCampId', {
        originCampId: filters.originCampId,
      });
    }

    if (filters?.destinationCampId !== undefined) {
      qb.andWhere('r.destinationCampId = :destinationCampId', {
        destinationCampId: filters.destinationCampId,
      });
    }

    if (filters?.involvedCampId !== undefined) {
      qb.andWhere('(r.originCampId = :involvedCampId OR r.destinationCampId = :involvedCampId)', {
        involvedCampId: filters.involvedCampId,
      });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('r.status = :status', { status: filters.status });
    }

    if (filters?.createdBy !== undefined) {
      qb.andWhere('r.createdBy = :createdBy', { createdBy: filters.createdBy });
    }

    if (filters?.respondedBy !== undefined) {
      qb.andWhere('r.respondedBy = :respondedBy', {
        respondedBy: filters.respondedBy,
      });
    }

    qb.orderBy('r.createdDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateIntercampRequestDTO): Promise<IntercampRequest | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<IntercampRequestEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
