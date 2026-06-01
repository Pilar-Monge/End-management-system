import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AchievementEntity } from '../achievement/achievement.entity';
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
      unlockedAt: data.unlockedAt ?? new Date(),
      unlockedBy: data.unlockedBy ?? null,
      progressSnapshot: data.progressSnapshot ?? null,
      sourceRunId: data.sourceRunId ?? null,
      unlockContext: data.unlockContext ?? null,
      isSeen: data.isSeen ?? false,
    });

    return await this.repo.save(entity);
  }

  async findByKey(campId: number, achievementId: number): Promise<CampAchievement | null> {
    return await this.repo.findOne({ where: { campId, achievementId } });
  }

  async findAchievementById(id: number): Promise<AchievementEntity | null> {
    return await this.repo.manager.getRepository(AchievementEntity).findOne({ where: { id } });
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

    qb.orderBy('ca.unlockedAt', 'DESC');

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

  async findLatestUnlocks(campId: number, limit = 5): Promise<CampAchievement[]> {
    return await this.repo.find({
      where: { campId, isSeen: false },
      order: { unlockedAt: 'DESC' },
      take: limit,
    });
  }

  async findProgress(campId: number): Promise<any[]> {
    return await this.repo.manager.query(
      `
      SELECT 
        a.id as "achievementId",
        a.name,
        a.description,
        a.metric_key as "metricKey",
        a.target_value as "targetValue",
        ca.unlocked_at as "unlockedAt",
        ca.progress_snapshot as "progressSnapshot",
        (ca.unlocked_at IS NOT NULL) as "isUnlocked"
      FROM achievement a
      LEFT JOIN camp_achievement ca ON ca.logro_id = a.id AND ca.camp_id = $1
      WHERE a.is_active = true
      ORDER BY a.id ASC
    `,
      [campId],
    );
  }

  async markAsSeen(campId: number, achievementId: number): Promise<boolean> {
    const result = await this.repo.update({ campId, achievementId }, { isSeen: true });
    return (result.affected ?? 0) > 0;
  }
}
