import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OccupationEntity } from './occupation.entity';
import type { CreateOccupationDTO, Occupation, UpdateOccupationDTO } from './occupation.model';

@Injectable()
export class OccupationRepository {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly repo: Repository<OccupationEntity>,
  ) {}

  async create(data: CreateOccupationDTO): Promise<Occupation> {
    const entity = this.repo.create({
      name: data.name,
      description: data.description ?? null,
      collectsResources: data.collectsResources ?? false,
      participatesInExpeditions: data.participatesInExpeditions ?? false,
      resourceTypeId: data.resourceTypeId ?? null,
      dailyAmountProduced: data.dailyAmountProduced ?? '0.00',
      dailyRationConsumed: data.dailyRationConsumed ?? '1.00',
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Occupation | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Occupation | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async findAllAndCount(filters?: {
    collectsResources?: boolean;
    participatesInExpeditions?: boolean;
    resourceTypeId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Occupation[]; total: number }> {
    const qb = this.repo.createQueryBuilder('o');

    if (filters?.collectsResources !== undefined) {
      qb.andWhere('o.collectsResources = :collectsResources', {
        collectsResources: filters.collectsResources,
      });
    }

    if (filters?.participatesInExpeditions !== undefined) {
      qb.andWhere('o.participatesInExpeditions = :participatesInExpeditions', {
        participatesInExpeditions: filters.participatesInExpeditions,
      });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('o.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    qb.orderBy('o.createdAt', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateOccupationDTO): Promise<Occupation | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<OccupationEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
