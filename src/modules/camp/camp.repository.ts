import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampEntity } from './camp.entity';
import type { Camp, CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';

@Injectable()
export class CampRepository {
  constructor(
    @InjectRepository(CampEntity)
    private readonly repo: Repository<CampEntity>,
  ) {}

  async create(data: CreateCampDTO): Promise<Camp> {
    const entity = this.repo.create({
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description ?? null,
      status: data.status ?? 'ACTIVE',
      foundationDate: data.foundationDate,
      maxPersonCapacity: data.maxPersonCapacity ?? 100,
      sessionInactivityMinutes: data.sessionInactivityMinutes ?? 20,
      minimumDailyRationPerPerson: data.minimumDailyRationPerPerson ?? '1.00',
      stockAlertThresholdPercentage: data.stockAlertThresholdPercentage ?? '20.00',
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Camp | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Camp | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async findAllAndCount(filters?: {
    status?: CampStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Camp[]; total: number }> {
    const qb = this.repo.createQueryBuilder('c');

    if (filters?.status !== undefined) {
      qb.andWhere('c.status = :status', { status: filters.status });
    }

    qb.orderBy('c.createdAt', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateCampDTO): Promise<Camp | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<CampEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
