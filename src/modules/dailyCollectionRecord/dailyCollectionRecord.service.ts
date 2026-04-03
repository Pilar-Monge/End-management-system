import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import type {
  CreateDailyCollectionRecordDTO,
  DailyCollectionRecord,
  UpdateDailyCollectionRecordDTO,
} from './dailyCollectionRecord.model';

@Injectable()
export class DailyCollectionRecordService {
  constructor(
    private readonly repository: DailyCollectionRecordRepository,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(InventoryMovementEntity)
    private readonly movementRepo: Repository<InventoryMovementEntity>,
  ) {}

  private async validateCampConsistency(
    campId: number,
    personId: number,
    recordedBy: number,
    resourceTypeId: number,
    movementId?: number | null,
  ): Promise<void> {
    const person = await this.personRepo.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.campId !== campId) {
      throw new BadRequestException('Person does not belong to the provided camp');
    }

    const user = await this.userRepo.findOne({ where: { id: recordedBy } });
    if (!user) {
      throw new NotFoundException('User who recorded the collection was not found');
    }

    if (user.campId !== campId) {
      throw new BadRequestException('RecordedBy user does not belong to the provided camp');
    }

    if (movementId === null || movementId === undefined) {
      return;
    }

    const movement = await this.movementRepo.findOne({ where: { id: movementId } });
    if (!movement) {
      throw new NotFoundException('Inventory movement not found');
    }

    if (movement.campId !== campId) {
      throw new BadRequestException('Movement does not belong to the provided camp');
    }

    if (movement.resourceTypeId !== resourceTypeId) {
      throw new BadRequestException(
        'Movement resource type does not match provided resourceTypeId',
      );
    }
  }

  async createRecord(data: CreateDailyCollectionRecordDTO): Promise<DailyCollectionRecord> {
    await this.validateCampConsistency(
      data.campId,
      data.personId,
      data.recordedBy,
      data.resourceTypeId,
      data.movementId,
    );

    const existing = await this.repository.findByPersonResourceDay(
      data.personId,
      data.resourceTypeId,
      data.date,
    );

    if (existing) {
      throw new Error(
        'A daily collection record for this person, resource type and date already exists',
      );
    }

    return await this.repository.create(data);
  }

  async getRecordById(id: number): Promise<DailyCollectionRecord | null> {
    return await this.repository.findById(id);
  }

  async getAllRecords(filters?: {
    campId?: number;
    personId?: number;
    resourceTypeId?: number;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: DailyCollectionRecord[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      personId?: number;
      resourceTypeId?: number;
      date?: string;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.date !== undefined) repoFilters.date = filters.date;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRecord(
    id: number,
    data: UpdateDailyCollectionRecordDTO,
  ): Promise<DailyCollectionRecord | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const campId = data.campId ?? existing.campId;
    const personId = data.personId ?? existing.personId;
    const recordedBy = data.recordedBy ?? existing.recordedBy;
    const resourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;
    const movementId = data.movementId !== undefined ? data.movementId : existing.movementId;

    await this.validateCampConsistency(campId, personId, recordedBy, resourceTypeId, movementId);

    return await this.repository.update(id, data);
  }

  async deleteRecord(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
