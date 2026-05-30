import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import type { SystemRole } from '../systemUser/systemUser.model';
import { UserEntity } from '../systemUser/systemUser.entity';

import { NotificationEntity } from './notification.entity';
import type {
  CreateNotificationDTO,
  Notification,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async create(data: CreateNotificationDTO): Promise<Notification> {
    const entity = this.repo.create({
      campId: data.campId,
      userId: data.userId ?? null,
      targetRole: data.targetRole ?? null,
      type: data.type,
      title: data.title,
      message: data.message,
      read: data.read ?? false,
      ...(data.createdDate !== undefined ? { createdDate: data.createdDate } : {}),
      readDate: data.readDate ?? null,
      sourceType: data.sourceType ?? null,
      sourceId: data.sourceId ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async findActiveUsersByCampAndRoles(
    campId: number,
    roles: SystemRole[],
  ): Promise<Array<Pick<UserEntity, 'id'>>> {
    if (roles.length === 0) {
      return [];
    }

    return await this.repo.manager.getRepository(UserEntity).find({
      select: {
        id: true,
      },
      where: {
        campId,
        role: In(roles),
        status: 'ACTIVE',
      },
    });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    userId?: number;
    currentRole?: SystemRole;
    targetRole?: SystemRole;
    type?: NotificationType;
    read?: boolean;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Notification[]; total: number }> {
    const qb = this.repo.createQueryBuilder('n');

    if (filters?.campId !== undefined) {
      qb.andWhere('n.campId = :campId', { campId: filters.campId });
    }

    if (filters?.userId !== undefined && filters?.currentRole !== undefined) {
      qb.andWhere(
        '(n.userId = :userId OR (n.userId IS NULL AND n.targetRole = :currentRole))',
        { userId: filters.userId, currentRole: filters.currentRole },
      );
    } else if (filters?.userId !== undefined) {
      qb.andWhere('n.userId = :userId', { userId: filters.userId });
    } else if (filters?.currentRole !== undefined) {
      qb.andWhere('n.userId IS NULL AND n.targetRole = :currentRole', {
        currentRole: filters.currentRole,
      });
    }

    if (filters?.targetRole !== undefined) {
      qb.andWhere('n.targetRole = :targetRole', { targetRole: filters.targetRole });
    }

    if (filters?.type !== undefined) {
      qb.andWhere('n.type = :type', { type: filters.type });
    }

    if (filters?.read !== undefined) {
      qb.andWhere('n.read = :read', { read: filters.read });
    }

    qb.orderBy('n.createdDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateNotificationDTO): Promise<Notification | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<NotificationEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
