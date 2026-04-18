import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { InventoryMovementEntity } from './inventoryMovement.entity';
import type {
  CreateInventoryMovementDTO,
  InventoryMovement,
  InventoryMovementType,
  UpdateInventoryMovementDTO,
} from './inventoryMovement.model';

@Injectable()
export class InventoryMovementRepository {
  constructor(
    @InjectRepository(InventoryMovementEntity)
    private readonly repo: Repository<InventoryMovementEntity>,
  ) {}

  async create(data: CreateInventoryMovementDTO): Promise<InventoryMovement> {
    const entity = this.repo.create({
      campId: data.campId,
      resourceTypeId: data.resourceTypeId,
      amount: data.amount,
      movementType: data.movementType,
      sourceId: data.sourceId ?? null,
      sourceType: data.sourceType ?? null,
      recordedBy: data.recordedBy,
      ...(data.date !== undefined ? { date: data.date } : {}),
      description: data.description ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<InventoryMovement | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findCampInventory(
    campId: number,
    resourceTypeId: number,
  ): Promise<CampInventoryEntity | null> {
    return await this.repo.manager.getRepository(CampInventoryEntity).findOne({
      where: { campId, resourceTypeId },
    });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    resourceTypeId?: number;
    movementType?: InventoryMovementType;
    recordedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: InventoryMovement[]; total: number }> {
    const qb = this.repo.createQueryBuilder('mov');

    if (filters?.campId !== undefined) {
      qb.andWhere('mov.campId = :campId', { campId: filters.campId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('mov.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    if (filters?.movementType !== undefined) {
      qb.andWhere('mov.movementType = :movementType', {
        movementType: filters.movementType,
      });
    }

    if (filters?.recordedBy !== undefined) {
      qb.andWhere('mov.recordedBy = :recordedBy', {
        recordedBy: filters.recordedBy,
      });
    }

    qb.orderBy('mov.date', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateInventoryMovementDTO): Promise<InventoryMovement | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<InventoryMovementEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
