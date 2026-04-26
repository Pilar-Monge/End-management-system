import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
  sendEmail?: boolean;
}

@Injectable()
export class NotificationService {
  private readonly emailEnabledByDefaultTypes: ReadonlySet<NotificationType> = new Set([
    'ADMISSION_REQUEST_PENDING',
    'ADMISSION_REQUEST_AI_REVIEWED',
    'ADMISSION_REQUEST_APPROVED',
    'ADMISSION_REQUEST_REJECTED',
    'INTERCAMP_REQUEST_RECEIVED',
    'INTERCAMP_REQUEST_APPROVED',
    'INTERCAMP_REQUEST_REJECTED',
    'INTERCAMP_REQUEST_CANCELED',
  ]);

  constructor(
    private readonly repository: NotificationRepository,
    private readonly dataSource: DataSource,
    private readonly emailOutboxService: EmailOutboxService,
  ) {}

  private shouldSendEmail(type: NotificationType, explicitValue?: boolean): boolean {
    if (explicitValue !== undefined) {
      return explicitValue;
    }

    return this.emailEnabledByDefaultTypes.has(type);
  }

  private resolveTemplateKeyForType(type: NotificationType): string {
    const templateByType: Partial<Record<NotificationType, string>> = {
      ADMISSION_REQUEST_PENDING: 'admission_request_pending',
      ADMISSION_REQUEST_APPROVED: 'admission_request_approved',
      ADMISSION_REQUEST_REJECTED: 'admission_request_rejected',
      ADMISSION_REQUEST_AI_REVIEWED: 'admission_request_ai_reviewed',
      ROLE_UPDATED: 'role_updated',
      USER_STATUS_UPDATED: 'user_status_updated',
      INVENTORY_ALERT: 'inventory_alert',
      OVERPOPULATION_ALERT: 'overpopulation_alert',
      INTERCAMP_REQUEST_RECEIVED: 'intercamp_request_received',
      INTERCAMP_REQUEST_APPROVED: 'intercamp_request_approved',
      INTERCAMP_REQUEST_REJECTED: 'intercamp_request_rejected',
      INTERCAMP_REQUEST_CANCELED: 'intercamp_request_canceled',
      EXPEDITION_RETURN: 'expedition_return',
      EXPEDITION_STATUS_UPDATED: 'expedition_status_updated',
      EXPEDITION_CREATED: 'expedition_created',
      EXPEDITION_COMPLETED: 'expedition_completed',
      EXPEDITION_RESOURCE_CONSUMED: 'expedition_resource_consumed',
      EXPEDITION_RESOURCE_OBTAINED: 'expedition_resource_obtained',
      TRANSFER_PENDING: 'transfer_pending',
      TRANSFER_COMPLETED: 'transfer_completed',
      TRANSFER_CANCELED: 'transfer_canceled',
      TRANSFER_PERSON_UPDATED: 'transfer_person_updated',
      REQUEST_PERSON_DETAIL_UPDATED: 'request_person_detail_updated',
      REQUEST_RESOURCE_DETAIL_UPDATED: 'request_resource_detail_updated',
      TRANSFER_RESOURCE_RECORDED: 'transfer_resource_recorded',
      PERSON_STATUS_CHANGED: 'person_status_changed',
      OCCUPATION_WITHOUT_STAFF: 'occupation_without_staff',
      TEMPORARY_OCCUPATION_ASSIGNED: 'temporary_occupation_assigned',
      CAMP_ACHIEVEMENT_UNLOCKED: 'camp_achievement_unlocked',
    };

    return templateByType[type] ?? 'generic_notification';
  }

  private async validateUserCamp(
    campId: number,
    userId?: number | null,
  ): Promise<{ id: number; campId: number; email: string | null } | null> {
    if (userId === null || userId === undefined) {
      return null;
    }

    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Usuario destino de la notificacion no encontrado');
    }

    if (user.campId !== campId) {
      throw new BadRequestException(
        'El usuario destino de la notificacion no pertenece al campamento proporcionado',
      );
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
    user: { email: string | null },
    title: string,
    message: string,
    notificationType: NotificationType,
    email?: NotificationEmailOptions,
  ): Promise<void> {
    if (!user.email || !user.email.trim()) {
      return;
    }

    await this.queueEmail({
      toEmail: user.email.trim(),
      subject: email?.subject ?? title,
      templateKey: email?.templateKey ?? this.resolveTemplateKeyForType(notificationType),
      payload: this.buildEmailPayload(title, message, email?.payload),
    });
  }

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const hasUser = data.userId !== undefined && data.userId !== null;
    const hasRole = data.targetRole !== undefined && data.targetRole !== null;
    if (!hasUser && !hasRole) {
      throw new Error('La notificacion debe dirigirse a un userId o a un targetRole');
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
      throw new Error('La notificacion debe dirigirse a un userId o a un targetRole');
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

    if (this.shouldSendEmail(options.type, options.sendEmail)) {
      const mergedEmailOptions: NotificationEmailOptions = {
        ...options.email,
        payload: {
          sourceType: options.sourceType ?? undefined,
          sourceId: options.sourceId ?? undefined,
          ...(options.email?.payload ?? {}),
        },
      };

      await this.queueEmailForUser(
        user,
        options.title,
        options.message,
        options.type,
        mergedEmailOptions,
      );
    }
    return notification;
  }

  async notifyUsers(userIds: number[], options: NotificationDispatchOptions): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)].filter(
      (userId) => Number.isInteger(userId) && userId > 0,
    );

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

    const users = await this.repository.findActiveUsersByCampAndRoles(campId, uniqueRoles);

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
