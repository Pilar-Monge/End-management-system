import { Injectable } from '@nestjs/common';

import { NotificationRepository } from './notification.repository';
import type {
  CreateNotificationDTO,
  Notification,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';
import type { SystemRole } from '../systemUser/systemUser.model';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const hasUser = data.userId !== undefined && data.userId !== null;
    const hasRole = data.targetRole !== undefined && data.targetRole !== null;
    if (!hasUser && !hasRole) {
      throw new Error('Notification must target a userId or a targetRole');
    }

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
    if (data.userId === null && data.targetRole === null) {
      throw new Error('Notification must target a userId or a targetRole');
    }
    return await this.repository.update(id, data);
  }

  async deleteNotification(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
