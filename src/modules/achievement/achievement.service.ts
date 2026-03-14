import { Injectable } from '@nestjs/common';

import { AchievementRepository } from './achievement.repository';
import type {
  Achievement,
  CreateAchievementDTO,
  UpdateAchievementDTO,
} from './achievement.model';

@Injectable()
export class AchievementService {
  constructor(private readonly repository: AchievementRepository) {}

  async createAchievement(data: CreateAchievementDTO): Promise<Achievement> {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error('An achievement with this name already exists');
    }
    return await this.repository.create(data);
  }

  async getAchievementById(id: number): Promise<Achievement | null> {
    return await this.repository.findById(id);
  }

  async getAllAchievements(filters?: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Achievement[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      name?: string;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.name !== undefined) repoFilters.name = filters.name;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateAchievement(id: number, data: UpdateAchievementDTO): Promise<Achievement | null> {
    if (data.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error('An achievement with this name already exists');
      }
    }
    return await this.repository.update(id, data);
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
