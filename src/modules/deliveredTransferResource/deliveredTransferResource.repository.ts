import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeliveredTransferResourceEntity } from './deliveredTransferResource.entity';
import type {
  CreateDeliveredTransferResourceDTO,
  DeliveredTransferResource,
  UpdateDeliveredTransferResourceDTO,
} from './deliveredTransferResource.model';

@Injectable()
export class DeliveredTransferResourceRepository {
  constructor(
    @InjectRepository(DeliveredTransferResourceEntity)
    private readonly repo: Repository<DeliveredTransferResourceEntity>,
  ) {}

  async create(
    data: CreateDeliveredTransferResourceDTO,
  ): Promise<DeliveredTransferResource> {
    const entity = this.repo.create({
      transferId: data.transferId,
      resourceTypeId: data.resourceTypeId,
      sentAmount: data.sentAmount,
      receivedAmount: data.receivedAmount,
      recordedBy: data.recordedBy,
      ...(data.recordDate !== undefined ? { recordDate: data.recordDate } : {}),
      movementId: data.movementId ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<DeliveredTransferResource | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByTransferAndResourceType(
    transferId: number,
    resourceTypeId: number,
  ): Promise<DeliveredTransferResource | null> {
    return await this.repo.findOne({ where: { transferId, resourceTypeId } });
  }

  async findAllAndCount(filters?: {
    transferId?: number;
    resourceTypeId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: DeliveredTransferResource[]; total: number }> {
    const qb = this.repo.createQueryBuilder('d');

    if (filters?.transferId !== undefined) {
      qb.andWhere('d.transferId = :transferId', { transferId: filters.transferId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('d.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    qb.orderBy('d.recordDate', 'DESC');

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
    data: UpdateDeliveredTransferResourceDTO,
  ): Promise<DeliveredTransferResource | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<DeliveredTransferResourceEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
