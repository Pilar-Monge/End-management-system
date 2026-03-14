import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransferHistoryEntity } from './transferHistory.entity';
import type {
  CreateTransferHistoryDTO,
  TransferHistory,
  UpdateTransferHistoryDTO,
} from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';

@Injectable()
export class TransferHistoryRepository {
  constructor(
    @InjectRepository(TransferHistoryEntity)
    private readonly repo: Repository<TransferHistoryEntity>,
  ) {}

  async create(data: CreateTransferHistoryDTO): Promise<TransferHistory> {
    const entity = this.repo.create({
      transferId: data.transferId,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      ...(data.date !== undefined ? { date: data.date } : {}),
      userId: data.userId,
      comment: data.comment ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<TransferHistory | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    transferId?: number;
    userId?: number;
    previousStatus?: TransferStatus;
    newStatus?: TransferStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: TransferHistory[]; total: number }> {
    const qb = this.repo.createQueryBuilder('h');

    if (filters?.transferId !== undefined) {
      qb.andWhere('h.transferId = :transferId', { transferId: filters.transferId });
    }

    if (filters?.userId !== undefined) {
      qb.andWhere('h.userId = :userId', { userId: filters.userId });
    }

    if (filters?.previousStatus !== undefined) {
      qb.andWhere('h.previousStatus = :previousStatus', {
        previousStatus: filters.previousStatus,
      });
    }

    if (filters?.newStatus !== undefined) {
      qb.andWhere('h.newStatus = :newStatus', { newStatus: filters.newStatus });
    }

    qb.orderBy('h.date', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateTransferHistoryDTO): Promise<TransferHistory | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<TransferHistoryEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
