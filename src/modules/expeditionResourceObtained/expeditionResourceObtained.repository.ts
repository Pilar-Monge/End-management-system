import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { ExpeditionResourceObtainedEntity } from './expeditionResourceObtained.entity';
import type {
  CreateExpeditionResourceObtainedDTO,
  ExpeditionResourceObtained,
  UpdateExpeditionResourceObtainedDTO,
} from './expeditionResourceObtained.model';

@Injectable()
export class ExpeditionResourceObtainedRepository {
  constructor(
    @InjectRepository(ExpeditionResourceObtainedEntity)
    private readonly repo: Repository<ExpeditionResourceObtainedEntity>,
  ) {}

  async create(data: CreateExpeditionResourceObtainedDTO): Promise<ExpeditionResourceObtained> {
    const entity = this.repo.create({
      expeditionId: data.expeditionId,
      resourceTypeId: data.resourceTypeId,
      amount: data.amount,
      recordedBy: data.recordedBy,
      ...(data.recordDate !== undefined ? { recordDate: data.recordDate } : {}),
      movementId: data.movementId ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<ExpeditionResourceObtained | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findExpeditionById(id: number): Promise<ExpeditionEntity | null> {
    return await this.repo.manager.getRepository(ExpeditionEntity).findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async findMovementById(id: number): Promise<InventoryMovementEntity | null> {
    return await this.repo.manager.getRepository(InventoryMovementEntity).findOne({
      where: { id },
    });
  }

  async findByExpeditionAndResourceType(
    expeditionId: number,
    resourceTypeId: number,
  ): Promise<ExpeditionResourceObtained | null> {
    return await this.repo.findOne({ where: { expeditionId, resourceTypeId } });
  }

  async findAllAndCount(filters?: {
    expeditionId?: number;
    resourceTypeId?: number;
    recordedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: ExpeditionResourceObtained[]; total: number }> {
    const qb = this.repo.createQueryBuilder('o');

    if (filters?.expeditionId !== undefined) {
      qb.andWhere('o.expeditionId = :expeditionId', { expeditionId: filters.expeditionId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('o.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    if (filters?.recordedBy !== undefined) {
      qb.andWhere('o.recordedBy = :recordedBy', { recordedBy: filters.recordedBy });
    }

    qb.orderBy('o.recordDate', 'DESC');

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
    data: UpdateExpeditionResourceObtainedDTO,
  ): Promise<ExpeditionResourceObtained | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<ExpeditionResourceObtainedEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
