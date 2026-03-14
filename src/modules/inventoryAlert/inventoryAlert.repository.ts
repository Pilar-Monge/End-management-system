import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InventoryAlertEntity } from './inventoryAlert.entity';
import type {
  CreateInventoryAlertDTO,
  InventoryAlert,
  UpdateInventoryAlertDTO,
} from './inventoryAlert.model';

@Injectable()
export class InventoryAlertRepository {
  constructor(
    @InjectRepository(InventoryAlertEntity)
    private readonly repo: Repository<InventoryAlertEntity>,
  ) {}

  async create(data: CreateInventoryAlertDTO): Promise<InventoryAlert> {
    const entity = this.repo.create({
      campId: data.campId,
      resourceTypeId: data.resourceTypeId,
      amountAtAlertGeneration: data.amountAtAlertGeneration,
      movementId: data.movementId ?? null,
      ...(data.alertDate !== undefined ? { alertDate: data.alertDate } : {}),
      resolved: data.resolved ?? false,
      resolutionDate: data.resolutionDate ?? null,
      resolvedBy: data.resolvedBy ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<InventoryAlert | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    resourceTypeId?: number;
    resolved?: boolean;
    offset?: number;
    limit?: number;
  }): Promise<{ data: InventoryAlert[]; total: number }> {
    const qb = this.repo.createQueryBuilder('alert');

    if (filters?.campId !== undefined) {
      qb.andWhere('alert.campId = :campId', { campId: filters.campId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('alert.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    if (filters?.resolved !== undefined) {
      qb.andWhere('alert.resolved = :resolved', { resolved: filters.resolved });
    }

    qb.orderBy('alert.alertDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateInventoryAlertDTO): Promise<InventoryAlert | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<InventoryAlertEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
