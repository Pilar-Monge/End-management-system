import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampAchievementEntity } from './campAchievement.entity';
import type {
  CampAchievement,
  CreateCampAchievementDTO,
  UpdateCampAchievementDTO,
} from './campAchievement.model';

@Injectable()
export class CampAchievementRepository {
  constructor(
    @InjectRepository(CampAchievementEntity)
    private readonly repo: Repository<CampAchievementEntity>,
  ) {}

  async create(data: CreateCampAchievementDTO): Promise<CampAchievement> {
    const entity = this.repo.create({
      campId: data.campId,
      achievementId: data.achievementId,
      ...(data.obtainedDate !== undefined ? { obtainedDate: data.obtainedDate } : {}),
      unlockedBy: data.unlockedBy,
      unlockContext: data.unlockContext ?? null,
    });

    return await this.repo.save(entity);
  }

  async findByKey(campId: number, achievementId: number): Promise<CampAchievement | null> {
    return await this.repo.findOne({ where: { campId, achievementId } });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    achievementId?: number;
    unlockedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: CampAchievement[]; total: number }> {
    const qb = this.repo.createQueryBuilder('ca');

    if (filters?.campId !== undefined) {
      qb.andWhere('ca.campId = :campId', { campId: filters.campId });
    }

    if (filters?.achievementId !== undefined) {
      qb.andWhere('ca.achievementId = :achievementId', {
        achievementId: filters.achievementId,
      });
    }

    if (filters?.unlockedBy !== undefined) {
      qb.andWhere('ca.unlockedBy = :unlockedBy', {
        unlockedBy: filters.unlockedBy,
      });
    }

    qb.orderBy('ca.obtainedDate', 'DESC');

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
    campId: number,
    achievementId: number,
    data: UpdateCampAchievementDTO,
  ): Promise<CampAchievement | null> {
    const existing = await this.repo.findOne({ where: { campId, achievementId } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<CampAchievementEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(campId: number, achievementId: number): Promise<boolean> {
    const result = await this.repo.delete({ campId, achievementId });
    return (result.affected ?? 0) > 0;
  }
}
