import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionEntity } from '../session/session.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { AccessLogEntity } from './accessLog.entity';
import type {
  AccessLog,
  AccessLogEventType,
  CreateAccessLogDTO,
  UpdateAccessLogDTO,
} from './accessLog.model';

@Injectable()
export class AccessLogRepository {
  constructor(
    @InjectRepository(AccessLogEntity)
    private readonly repo: Repository<AccessLogEntity>,
  ) {}

  async create(data: CreateAccessLogDTO): Promise<AccessLog> {
    const entity = this.repo.create({
      sessionId: data.sessionId ?? null,
      userId: data.userId,
      campId: data.campId,
      ...(data.eventDate !== undefined ? { eventDate: data.eventDate } : {}),
      eventType: data.eventType,
      sourceIp: data.sourceIp ?? null,
      detail: data.detail ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<AccessLog | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async findSessionById(id: number): Promise<SessionEntity | null> {
    return await this.repo.manager.getRepository(SessionEntity).findOne({ where: { id } });
  }

  async findAllAndCount(filters?: {
    userId?: number;
    campId?: number;
    sessionId?: number;
    eventType?: AccessLogEventType;
    offset?: number;
    limit?: number;
  }): Promise<{ data: AccessLog[]; total: number }> {
    const qb = this.repo.createQueryBuilder('log');

    if (filters?.userId !== undefined) {
      qb.andWhere('log.userId = :userId', { userId: filters.userId });
    }

    if (filters?.campId !== undefined) {
      qb.andWhere('log.campId = :campId', { campId: filters.campId });
    }

    if (filters?.sessionId !== undefined) {
      qb.andWhere('log.sessionId = :sessionId', { sessionId: filters.sessionId });
    }

    if (filters?.eventType !== undefined) {
      qb.andWhere('log.eventType = :eventType', { eventType: filters.eventType });
    }

    qb.orderBy('log.eventDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateAccessLogDTO): Promise<AccessLog | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<AccessLogEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
