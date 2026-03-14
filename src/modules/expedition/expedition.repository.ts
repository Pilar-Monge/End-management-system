import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpeditionEntity } from './expedition.entity';
import type {
  CreateExpeditionDTO,
  Expedition,
  ExpeditionStatus,
  UpdateExpeditionDTO,
} from './expedition.model';

@Injectable()
export class ExpeditionRepository {
  constructor(
    @InjectRepository(ExpeditionEntity)
    private readonly repo: Repository<ExpeditionEntity>,
  ) {}

  async create(data: CreateExpeditionDTO): Promise<Expedition> {
    const entity = this.repo.create({
      campId: data.campId,
      name: data.name,
      objective: data.objective ?? null,
      destinationDescription: data.destinationDescription ?? null,
      destinationLatitude: data.destinationLatitude ?? null,
      destinationLongitude: data.destinationLongitude ?? null,
      plannedDepartureDate: data.plannedDepartureDate,
      actualDepartureDate: data.actualDepartureDate ?? null,
      plannedReturnDate: data.plannedReturnDate,
      actualReturnDate: data.actualReturnDate ?? null,
      extraDaysAvailable: data.extraDaysAvailable ?? 0,
      extraDaysUsed: data.extraDaysUsed ?? 0,
      status: data.status ?? 'PLANNED',
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Expedition | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    status?: ExpeditionStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Expedition[]; total: number }> {
    const qb = this.repo.createQueryBuilder('e');

    if (filters?.campId !== undefined) {
      qb.andWhere('e.campId = :campId', { campId: filters.campId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('e.status = :status', { status: filters.status });
    }

    qb.orderBy('e.plannedDepartureDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateExpeditionDTO): Promise<Expedition | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<ExpeditionEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
