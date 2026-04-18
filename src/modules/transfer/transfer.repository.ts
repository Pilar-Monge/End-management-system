import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { TransferEntity } from './transfer.entity';
import type {
  CreateTransferDTO,
  Transfer,
  TransferStatus,
  UpdateTransferDTO,
} from './transfer.model';

@Injectable()
export class TransferRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly repo: Repository<TransferEntity>,
  ) {}

  async create(data: CreateTransferDTO): Promise<Transfer> {
    const entity = this.repo.create({
      requestId: data.requestId,
      plannedDepartureDate: data.plannedDepartureDate,
      actualDepartureDate: data.actualDepartureDate ?? null,
      plannedArrivalDate: data.plannedArrivalDate,
      actualArrivalDate: data.actualArrivalDate ?? null,
      status: data.status ?? 'PENDING_DEPARTURE',
      departureApprovedBy: data.departureApprovedBy ?? null,
      arrivalApprovedBy: data.arrivalApprovedBy ?? null,
      rationsForTrip: data.rationsForTrip ?? '0.00',
      receptionNotes: data.receptionNotes ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Transfer | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByRequestId(requestId: number): Promise<Transfer | null> {
    return await this.repo.findOne({ where: { requestId } });
  }

  async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
    createdBy: number;
    respondedBy: number | null;
  } | null> {
    const request = await this.repo.manager.getRepository(IntercampRequestEntity).findOne({
      where: { id: requestId },
      select: {
        originCampId: true,
        destinationCampId: true,
        createdBy: true,
        respondedBy: true,
      },
    });

    if (!request) {
      return null;
    }

    return {
      originCampId: request.originCampId,
      destinationCampId: request.destinationCampId,
      createdBy: request.createdBy,
      respondedBy: request.respondedBy,
    };
  }

  async findAllAndCount(filters?: {
    requestId?: number;
    status?: TransferStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Transfer[]; total: number }> {
    const qb = this.repo.createQueryBuilder('t');

    if (filters?.requestId !== undefined) {
      qb.andWhere('t.requestId = :requestId', { requestId: filters.requestId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('t.status = :status', { status: filters.status });
    }

    qb.orderBy('t.plannedDepartureDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateTransferDTO): Promise<Transfer | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<TransferEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
