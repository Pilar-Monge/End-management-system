import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationRepository } from './notification.repository';
import type {
  CreateNotificationDTO,
  Notification,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';
import type { SystemRole } from '../systemUser/systemUser.model';
import { UserEntity } from '../systemUser/systemUser.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly repository: NotificationRepository,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private async validateUserCamp(campId: number, userId?: number | null): Promise<void> {
    if (userId === null || userId === undefined) {
      return;
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Notification user was not found');
    }

    if (user.campId !== campId) {
      throw new BadRequestException('Notification user does not belong to the provided camp');
    }
  }

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const hasUser = data.userId !== undefined && data.userId !== null;
    const hasRole = data.targetRole !== undefined && data.targetRole !== null;
    if (!hasUser && !hasRole) {
      throw new Error('Notification must target a userId or a targetRole');
    }

    await this.validateUserCamp(data.campId, data.userId);

    return await this.repository.create(data);
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    return await this.repository.findById(id);
  }

  async getAllNotifications(filters?: {
    campId?: number;
    userId?: number;
    targetRole?: SystemRole;
    type?: NotificationType;
    read?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Notification[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      userId?: number;
      targetRole?: SystemRole;
      type?: NotificationType;
      read?: boolean;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.userId !== undefined) repoFilters.userId = filters.userId;
    if (filters?.targetRole !== undefined) repoFilters.targetRole = filters.targetRole;
    if (filters?.type !== undefined) repoFilters.type = filters.type;
    if (filters?.read !== undefined) repoFilters.read = filters.read;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateNotification(id: number, data: UpdateNotificationDTO): Promise<Notification | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.userId === null && data.targetRole === null) {
      throw new Error('Notification must target a userId or a targetRole');
    }

    const finalCampId = data.campId ?? existing.campId;
    const finalUserId = data.userId !== undefined ? data.userId : existing.userId;

    await this.validateUserCamp(finalCampId, finalUserId);

    return await this.repository.update(id, data);
  }

  async deleteNotification(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
