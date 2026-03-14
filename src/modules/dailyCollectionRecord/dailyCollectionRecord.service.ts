import { Injectable } from '@nestjs/common';

import { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import type {
  CreateDailyCollectionRecordDTO,
  DailyCollectionRecord,
  UpdateDailyCollectionRecordDTO,
} from './dailyCollectionRecord.model';

@Injectable()
export class DailyCollectionRecordService {
  constructor(private readonly repository: DailyCollectionRecordRepository) {}

  async createRecord(data: CreateDailyCollectionRecordDTO): Promise<DailyCollectionRecord> {
    const existing = await this.repository.findByPersonResourceDay(
      data.personId,
      data.resourceTypeId,
      data.date,
    );

    if (existing) {
      throw new Error('A daily collection record for this person, resource type and date already exists');
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

  async updateRecord(id: number, data: UpdateDailyCollectionRecordDTO): Promise<DailyCollectionRecord | null> {
    return await this.repository.update(id, data);
  }

  async deleteRecord(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
