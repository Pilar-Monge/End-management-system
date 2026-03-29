import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { PersonStatusHistoryEntity } from './personStatusHistory.entity';
import { PersonStatusHistoryRepository } from './personStatusHistory.repository';
import type {
  CreatePersonStatusHistoryDTO,
  PersonStatus,
  PersonStatusHistory,
  UpdatePersonStatusHistoryDTO,
} from './personStatusHistory.model';

@Injectable()
export class PersonStatusHistoryService {
  constructor(
    private readonly repository: PersonStatusHistoryRepository,
    private readonly dataSource: DataSource,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private async validateAdminFromSameCamp(personId: number, changedBy: number): Promise<void> {
    const person = await this.personRepo.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const user = await this.userRepo.findOne({ where: { id: changedBy } });
    if (!user) {
      throw new NotFoundException('User who changed status not found');
    }

    if (user.role !== 'SYSTEM_ADMIN') {
      throw new ForbiddenException('Only SYSTEM_ADMIN users can change person status');
    }

    if (user.campId !== person.campId) {
      throw new BadRequestException('User camp does not match person camp');
    }
  }

  async createEntry(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    return await this.dataSource.transaction(async (manager) => {
      const personRepo = manager.getRepository(PersonEntity);
      const userRepo = manager.getRepository(UserEntity);
      const historyRepo = manager.getRepository(PersonStatusHistoryEntity);

      const person = await personRepo.findOne({ where: { id: data.personId } });
      if (!person) {
        throw new NotFoundException('Person not found');
      }

      const changedByUser = await userRepo.findOne({ where: { id: data.changedBy } });
      if (!changedByUser) {
        throw new NotFoundException('User who changed status not found');
      }

      if (changedByUser.role !== 'SYSTEM_ADMIN') {
        throw new ForbiddenException('Only SYSTEM_ADMIN users can change person status');
      }

      if (changedByUser.campId !== person.campId) {
        throw new BadRequestException('User camp does not match person camp');
      }

      if (person.currentStatus !== data.previousStatus) {
        throw new BadRequestException('previousStatus does not match current person status');
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

  async getEntryById(id: number): Promise<PersonStatusHistory | null> {
    return await this.repository.findById(id);
  }

  async getAllEntries(filters?: {
    personId?: number;
    changedBy?: number;
    previousStatus?: PersonStatus;
    newStatus?: PersonStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: PersonStatusHistory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      personId?: number;
      changedBy?: number;
      previousStatus?: PersonStatus;
      newStatus?: PersonStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.changedBy !== undefined) repoFilters.changedBy = filters.changedBy;
    if (filters?.previousStatus !== undefined) repoFilters.previousStatus = filters.previousStatus;
    if (filters?.newStatus !== undefined) repoFilters.newStatus = filters.newStatus;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateEntry(id: number, data: UpdatePersonStatusHistoryDTO): Promise<PersonStatusHistory | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const personIdToValidate = data.personId ?? existing.personId;
    const changedByToValidate = data.changedBy ?? existing.changedBy;
    await this.validateAdminFromSameCamp(personIdToValidate, changedByToValidate);

    return await this.repository.update(id, data);
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
