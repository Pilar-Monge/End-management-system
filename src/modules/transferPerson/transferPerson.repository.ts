import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransferPersonEntity } from './transferPerson.entity';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  TransferPerson,
  UpdateTransferPersonDTO,
} from './transferPerson.model';

@Injectable()
export class TransferPersonRepository {
  constructor(
    @InjectRepository(TransferPersonEntity)
    private readonly repo: Repository<TransferPersonEntity>,
  ) {}

  async create(data: CreateTransferPersonDTO): Promise<TransferPerson> {
    const entity = this.repo.create({
      transferId: data.transferId,
      personId: data.personId,
      status: data.status ?? 'CONFIRMED',
      departureDate: data.departureDate ?? null,
      arrivalDate: data.arrivalDate ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<TransferPerson | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByTransferAndPerson(
    transferId: number,
    personId: number,
  ): Promise<TransferPerson | null> {
    return await this.repo.findOne({ where: { transferId, personId } });
  }

  async findAllAndCount(filters?: {
    transferId?: number;
    personId?: number;
    status?: PersonTransferStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: TransferPerson[]; total: number }> {
    const qb = this.repo.createQueryBuilder('p');

    if (filters?.transferId !== undefined) {
      qb.andWhere('p.transferId = :transferId', { transferId: filters.transferId });
    }

    if (filters?.personId !== undefined) {
      qb.andWhere('p.personId = :personId', { personId: filters.personId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('p.status = :status', { status: filters.status });
    }

    qb.orderBy('p.id', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateTransferPersonDTO): Promise<TransferPerson | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<TransferPersonEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
