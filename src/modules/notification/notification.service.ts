import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { EmailOutboxService } from '../email/emailOutbox.service';
import { CampEntity } from '../camp/camp.entity';
import { NotificationRepository } from './notification.repository';
import type {
  CreateNotificationDTO,
  Notification,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';
import type { SystemRole } from '../systemUser/systemUser.model';
import { UserEntity } from '../systemUser/systemUser.entity';

interface NotificationEmailOptions {
  subject?: string;
  templateKey?: string;
  payload?: Record<string, unknown>;
}

interface NotificationDispatchOptions {
  campId: number;
  type: NotificationType;
  title: string;
  message: string;
  sourceType?: string | null;
  sourceId?: number | null;
  email?: NotificationEmailOptions;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly dataSource: DataSource,
    private readonly emailOutboxService: EmailOutboxService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private async validateUserCamp(
    campId: number,
    userId?: number | null,
  ): Promise<UserEntity | null> {
    if (userId === null || userId === undefined) {
      return null;
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Notification user was not found');
    }

    if (user.campId !== campId) {
      throw new BadRequestException('Notification user does not belong to the provided camp');
    }

    return user;
  }

  private buildEmailPayload(
    title: string,
    message: string,
    emailPayload?: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      title,
      message,
      ...(emailPayload ?? {}),
    };
  }

  async queueEmail(data: {
    toEmail: string;
    subject: string;
    templateKey?: string;
    payload?: Record<string, unknown>;
    maxAttempts?: number;
  }): Promise<void> {
    if (!data.toEmail.trim()) {
      return;
    }

    const enqueueData: {
      toEmail: string;
      subject: string;
      templateKey: string;
      payload: Record<string, unknown>;
      maxAttempts?: number;
    } = {
      toEmail: data.toEmail.trim(),
      subject: data.subject,
      templateKey: data.templateKey ?? 'generic_notification',
      payload: data.payload ?? {},
    };

    if (data.maxAttempts !== undefined) {
      enqueueData.maxAttempts = data.maxAttempts;
    }

    await this.emailOutboxService.enqueue(enqueueData);
  }

  private async queueEmailForUser(
    user: UserEntity,
    title: string,
    message: string,
    email?: NotificationEmailOptions,
  ): Promise<void> {
    if (!user.email || !user.email.trim()) {
      return;
    }

    await this.queueEmail({
      toEmail: user.email.trim(),
      subject: email?.subject ?? title,
      templateKey: email?.templateKey ?? 'generic_notification',
      payload: this.buildEmailPayload(title, message, email?.payload),
    });
  }

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const hasUser = data.userId !== undefined && data.userId !== null;
    const hasRole = data.targetRole !== undefined && data.targetRole !== null;
    if (!hasUser && !hasRole) {
      throw new Error('Notification must target a userId or a targetRole');
    }

    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
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

    await assertEntityExists(this.dataSource, CampEntity, finalCampId, 'Camp');
    await this.validateUserCamp(finalCampId, finalUserId);

    if (data.read === true) {
      data.readDate = new Date();
    } else if (data.read === false) {
      data.readDate = null;
    }

    return await this.repository.update(id, data);
  }

  async deleteNotification(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async notifyUser(
    userId: number,
    options: NotificationDispatchOptions,
  ): Promise<Notification | null> {
    const user = await this.validateUserCamp(options.campId, userId);
    if (!user) {
      return null;
    }

    const createData: CreateNotificationDTO = {
      campId: options.campId,
      userId,
      type: options.type,
      title: options.title,
      message: options.message,
    };

    if (options.sourceType !== undefined) {
      createData.sourceType = options.sourceType;
    }
    if (options.sourceId !== undefined) {
      createData.sourceId = options.sourceId;
    }

    const notification = await this.createNotification(createData);

    await this.queueEmailForUser(user, options.title, options.message, options.email);
    return notification;
  }

  async notifyUsers(userIds: number[], options: NotificationDispatchOptions): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)].filter((userId) => Number.isInteger(userId) && userId > 0);

    for (const userId of uniqueUserIds) {
      await this.notifyUser(userId, options);
    }
  }

  async notifyCampRoles(
    campId: number,
    roles: SystemRole[],
    options: Omit<NotificationDispatchOptions, 'campId'>,
  ): Promise<void> {
    const uniqueRoles = [...new Set(roles)];
    if (uniqueRoles.length === 0) {
      return;
    }

    const users = await this.userRepo.find({
      select: {
        id: true,
        campId: true,
        email: true,
        status: true,
      },
      where: {
        campId,
        role: In(uniqueRoles),
        status: 'ACTIVE',
      },
    });

    if (users.length === 0) {
      return;
    }

    await this.notifyUsers(
      users.map((user) => user.id),
      {
        campId,
        ...options,
      },
    );
  }
}
