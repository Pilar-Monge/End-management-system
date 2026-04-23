import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { PersonStatusHistoryEntity } from './personStatusHistory.entity';
import type {
  CreatePersonStatusHistoryDTO,
  PersonStatus,
  PersonStatusHistory,
  UpdatePersonStatusHistoryDTO,
} from './personStatusHistory.model';

@Injectable()
export class PersonStatusHistoryRepository {
  constructor(
    @InjectRepository(PersonStatusHistoryEntity)
    private readonly repo: Repository<PersonStatusHistoryEntity>,
  ) {}

  async create(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    const entity = this.repo.create({
      personId: data.personId,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      reason: data.reason ?? null,
      changedBy: data.changedBy,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<PersonStatusHistory | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findPersonById(id: number): Promise<PersonEntity | null> {
    return await this.repo.manager.getRepository(PersonEntity).findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async findPersonCampInfo(personId: number): Promise<Pick<PersonEntity, 'id' | 'campId'> | null> {
    return await this.repo.manager.getRepository(PersonEntity).findOne({
      where: { id: personId },
      select: {
        id: true,
        campId: true,
      },
    });
  }

  async findAssociatedUserByPersonAndCamp(
    personId: number,
    campId: number,
  ): Promise<Pick<UserEntity, 'id'> | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({
      where: {
        personId,
        campId,
      },
      select: {
        id: true,
      },
    });
  }

  async createEntryTransactional(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    return await this.repo.manager.transaction(async (manager) => {
      const personRepo = manager.getRepository(PersonEntity);
      const userRepo = manager.getRepository(UserEntity);
      const historyRepo = manager.getRepository(PersonStatusHistoryEntity);

      const person = await personRepo.findOne({ where: { id: data.personId } });
      if (!person) {
        throw new Error('PERSON_NOT_FOUND');
      }

      const changedByUser = await userRepo.findOne({ where: { id: data.changedBy } });
      if (!changedByUser) {
        throw new Error('CHANGED_BY_NOT_FOUND');
      }

      if (changedByUser.role !== 'SYSTEM_ADMIN') {
        throw new Error('ONLY_SYSTEM_ADMIN');
      }

      if (changedByUser.campId !== person.campId) {
        throw new Error('CAMP_MISMATCH');
      }

      if (person.currentStatus !== data.previousStatus) {
        throw new Error('PREVIOUS_STATUS_MISMATCH');
      }

      person.currentStatus = data.newStatus;
      await personRepo.save(person);

      const historyEntry = historyRepo.create({
        personId: data.personId,
        previousStatus: data.previousStatus,
        newStatus: data.newStatus,
        reason: data.reason ?? null,
        changedBy: data.changedBy,
      });

      return await historyRepo.save(historyEntry);
    });
  }

  async findAllAndCount(filters?: {
    personId?: number;
    changedBy?: number;
    previousStatus?: PersonStatus;
    newStatus?: PersonStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: PersonStatusHistory[]; total: number }> {
    const qb = this.repo.createQueryBuilder('h');

    if (filters?.personId !== undefined) {
      qb.andWhere('h.personId = :personId', { personId: filters.personId });
    }

    if (filters?.changedBy !== undefined) {
      qb.andWhere('h.changedBy = :changedBy', { changedBy: filters.changedBy });
    }

    if (filters?.previousStatus !== undefined) {
      qb.andWhere('h.previousStatus = :previousStatus', {
        previousStatus: filters.previousStatus,
      });
    }

    if (filters?.newStatus !== undefined) {
      qb.andWhere('h.newStatus = :newStatus', {
        newStatus: filters.newStatus,
      });
    }

    qb.orderBy('h.changeDate', 'DESC');

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
    data: UpdatePersonStatusHistoryDTO,
  ): Promise<PersonStatusHistory | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<PersonStatusHistoryEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
