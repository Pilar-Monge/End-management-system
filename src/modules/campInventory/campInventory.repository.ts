import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampInventoryEntity } from './campInventory.entity';
import type {
  CampInventory,
  CreateCampInventoryDTO,
  UpdateCampInventoryDTO,
} from './campInventory.model';

@Injectable()
export class CampInventoryRepository {
  constructor(
    @InjectRepository(CampInventoryEntity)
    private readonly repo: Repository<CampInventoryEntity>,
  ) {}

  async create(data: CreateCampInventoryDTO): Promise<CampInventory> {
    const entity = this.repo.create({
      campId: data.campId,
      resourceTypeId: data.resourceTypeId,
      currentAmount: data.currentAmount ?? '0.00',
      minimumAlertAmount: data.minimumAlertAmount ?? '0.00',
    });

    return await this.repo.save(entity);
  }

  async findByKey(campId: number, resourceTypeId: number): Promise<CampInventory | null> {
    return await this.repo.findOne({ where: { campId, resourceTypeId } });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    resourceTypeId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: CampInventory[]; total: number }> {
    const qb = this.repo.createQueryBuilder('ci');

    if (filters?.campId !== undefined) {
      qb.andWhere('ci.campId = :campId', { campId: filters.campId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('ci.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    qb.orderBy('ci.lastUpdate', 'DESC');

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
    campId: number,
    resourceTypeId: number,
    data: UpdateCampInventoryDTO,
  ): Promise<CampInventory | null> {
    const existing = await this.repo.findOne({ where: { campId, resourceTypeId } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<CampInventoryEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(campId: number, resourceTypeId: number): Promise<boolean> {
    const result = await this.repo.delete({ campId, resourceTypeId });
    return (result.affected ?? 0) > 0;
  }
}
