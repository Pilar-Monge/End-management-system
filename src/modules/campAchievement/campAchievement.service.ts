import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { AchievementEntity } from '../achievement/achievement.entity';
import { CampEntity } from '../camp/camp.entity';
import { NotificationService } from '../notification/notification.service';
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
    private readonly notificationService: NotificationService,
  ) {}

  private async notifyCampAchievement(
    campAchievement: Pick<CampAchievement, 'campId' | 'achievementId' | 'unlockedBy'>,
    sourceId: number,
    title: string,
    messagePrefix: string,
  ): Promise<void> {
    const achievement = await this.repository.findAchievementById(campAchievement.achievementId);
    if (!achievement) {
      return;
    }

    const message = `${messagePrefix}: ${achievement.name}.`;
    await this.notificationService.notifyCampRoles(
      campAchievement.campId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'CAMP_ACHIEVEMENT_UNLOCKED',
        title,
        message,
        sourceType: 'camp_achievement',
        sourceId,
      },
    );

    if (campAchievement.unlockedBy) {
      await this.notificationService.notifyUser(campAchievement.unlockedBy, {
        campId: campAchievement.campId,
        type: 'CAMP_ACHIEVEMENT_UNLOCKED',
        title: 'Logro registrado',
        message: `El logro ${achievement.name} fue registrado para tu campamento.`,
        sourceType: 'camp_achievement',
        sourceId,
      });
    }
  }

  async createCampAchievement(data: CreateCampAchievementDTO): Promise<CampAchievement> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(this.dataSource, AchievementEntity, data.achievementId, 'Achievement');
    if (data.unlockedBy) {
      await assertEntityExists(this.dataSource, UserEntity, data.unlockedBy, 'User');
    }

    const existing = await this.repository.findByKey(data.campId, data.achievementId);
    if (existing) {
      throw new Error('Este logro de campamento ya existe');
    }

    const created = await this.repository.create(data);
    await this.notifyCampAchievement(
      created,
      created.achievementId,
      'Logro desbloqueado',
      'Se desbloqueo un logro del campamento',
    );

    return created;
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

    const updated = await this.repository.update(campId, achievementId, data);
    if (!updated) {
      return null;
    }

    await this.notifyCampAchievement(
      updated,
      updated.achievementId,
      'Logro del campamento actualizado',
      'El registro del logro del campamento fue actualizado',
    );

    return updated;
  }

  async deleteCampAchievement(campId: number, achievementId: number): Promise<boolean> {
    const existing = await this.repository.findByKey(campId, achievementId);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(campId, achievementId);
    if (!deleted) {
      return false;
    }

    await this.notifyCampAchievement(
      existing,
      existing.achievementId,
      'Logro del campamento eliminado',
      'El registro del logro del campamento fue eliminado',
    );

    return true;
  }

  async getLatestUnlocks(campId: number, limit?: number): Promise<CampAchievement[]> {
    return await this.repository.findLatestUnlocks(campId, limit);
  }

  async getAchievementProgress(campId: number): Promise<any[]> {
    return await this.repository.findProgress(campId);
  }

  async markAchievementAsSeen(campId: number, achievementId: number): Promise<boolean> {
    return await this.repository.markAsSeen(campId, achievementId);
  }
}
