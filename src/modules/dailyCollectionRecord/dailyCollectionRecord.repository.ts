import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { DailyCollectionRecordEntity } from './dailyCollectionRecord.entity';
import type {
  CreateDailyCollectionRecordDTO,
  DailyCollectionRecord,
  UpdateDailyCollectionRecordDTO,
} from './dailyCollectionRecord.model';

@Injectable()
export class DailyCollectionRecordRepository {
  constructor(
    @InjectRepository(DailyCollectionRecordEntity)
    private readonly repo: Repository<DailyCollectionRecordEntity>,
  ) {}

  async create(data: CreateDailyCollectionRecordDTO): Promise<DailyCollectionRecord> {
    const entity = this.repo.create({
      campId: data.campId,
      personId: data.personId,
      resourceTypeId: data.resourceTypeId,
      date: data.date,
      expectedAmount: data.expectedAmount ?? '0.00',
      actualAmount: data.actualAmount ?? '0.00',
      differenceReason: data.differenceReason ?? null,
      recordedBy: data.recordedBy,
      movementId: data.movementId ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<DailyCollectionRecord | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByPersonResourceDay(
    personId: number,
    resourceTypeId: number,
    date: Date,
  ): Promise<DailyCollectionRecord | null> {
    return await this.repo.findOne({ where: { personId, resourceTypeId, date } });
  }

  async findPersonById(id: number): Promise<PersonEntity | null> {
    return await this.repo.manager.getRepository(PersonEntity).findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async findMovementById(id: number): Promise<InventoryMovementEntity | null> {
    return await this.repo.manager
      .getRepository(InventoryMovementEntity)
      .findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    personId?: number;
    resourceTypeId?: number;
    date?: string;
    offset?: number;
    limit?: number;
  }): Promise<{ data: DailyCollectionRecord[]; total: number }> {
    const qb = this.repo.createQueryBuilder('col');

    if (filters?.campId !== undefined) {
      qb.andWhere('col.campId = :campId', { campId: filters.campId });
    }

    if (filters?.personId !== undefined) {
      qb.andWhere('col.personId = :personId', { personId: filters.personId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('col.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    if (filters?.date !== undefined) {
      qb.andWhere('col.date = :date', { date: filters.date });
    }

    qb.orderBy('col.date', 'DESC');

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
    data: UpdateDailyCollectionRecordDTO,
  ): Promise<DailyCollectionRecord | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<DailyCollectionRecordEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
