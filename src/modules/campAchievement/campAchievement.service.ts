import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { AchievementEntity } from '../achievement/achievement.entity';
import { CampEntity } from '../camp/camp.entity';
import { UserEntity } from '../systemUser/systemUser.entity';

import { CampAchievementRepository } from './campAchievement.repository';
import type {
  CampAchievement,
  CreateCampAchievementDTO,
  UpdateCampAchievementDTO,
} from './campAchievement.model';

@Injectable()
export class CampAchievementService {
  constructor(
    private readonly repository: CampAchievementRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createCampAchievement(data: CreateCampAchievementDTO): Promise<CampAchievement> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(this.dataSource, AchievementEntity, data.achievementId, 'Achievement');
    await assertEntityExists(this.dataSource, UserEntity, data.unlockedBy, 'User');

    const existing = await this.repository.findByKey(data.campId, data.achievementId);
    if (existing) {
      throw new Error('This camp achievement already exists');
    }
    return await this.repository.create(data);
  }

  async getCampAchievementByKey(
    campId: number,
    achievementId: number,
  ): Promise<CampAchievement | null> {
    return await this.repository.findByKey(campId, achievementId);
  }

  async getAllCampAchievements(filters?: {
    campId?: number;
    achievementId?: number;
    unlockedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CampAchievement[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      achievementId?: number;
      unlockedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.achievementId !== undefined) repoFilters.achievementId = filters.achievementId;
    if (filters?.unlockedBy !== undefined) repoFilters.unlockedBy = filters.unlockedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateCampAchievement(
    campId: number,
    achievementId: number,
    data: UpdateCampAchievementDTO,
  ): Promise<CampAchievement | null> {
    if (data.unlockedBy !== undefined) {
      await assertEntityExists(this.dataSource, UserEntity, data.unlockedBy, 'User');
    }

    return await this.repository.update(campId, achievementId, data);
  }

  async deleteCampAchievement(campId: number, achievementId: number): Promise<boolean> {
    return await this.repository.delete(campId, achievementId);
  }
}
