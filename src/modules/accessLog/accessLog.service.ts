import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionEntity } from '../session/session.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { AccessLogRepository } from './accessLog.repository';
import type {
  AccessLog,
  AccessLogEventType,
  CreateAccessLogDTO,
  UpdateAccessLogDTO,
} from './accessLog.model';

@Injectable()
export class AccessLogService {
  constructor(
    private readonly repository: AccessLogRepository,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  private async validateLogOwnership(
    userId: number,
    campId: number,
    sessionId?: number | null,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.campId !== campId) {
      throw new BadRequestException('User does not belong to the provided camp');
    }

    if (sessionId === null || sessionId === undefined) {
      return;
    }

    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new BadRequestException('Session does not belong to the provided user');
    }

    if (session.campId !== campId) {
      throw new BadRequestException('Session does not belong to the provided camp');
    }
  }

  async createLog(data: CreateAccessLogDTO): Promise<AccessLog> {
    await this.validateLogOwnership(data.userId, data.campId, data.sessionId);
    return await this.repository.create(data);
  }

  async getLogById(id: number): Promise<AccessLog | null> {
    return await this.repository.findById(id);
  }

  async getAllLogs(filters?: {
    userId?: number;
    campId?: number;
    sessionId?: number;
    eventType?: AccessLogEventType;
    page?: number;
    limit?: number;
  }): Promise<{ data: AccessLog[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      userId?: number;
      campId?: number;
      sessionId?: number;
      eventType?: AccessLogEventType;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.userId !== undefined) repoFilters.userId = filters.userId;
    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.sessionId !== undefined) repoFilters.sessionId = filters.sessionId;
    if (filters?.eventType !== undefined) repoFilters.eventType = filters.eventType;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateLog(id: number, data: UpdateAccessLogDTO): Promise<AccessLog | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const userIdToValidate = data.userId ?? existing.userId;
    const campIdToValidate = data.campId ?? existing.campId;
    const sessionIdToValidate = data.sessionId !== undefined ? data.sessionId : existing.sessionId;

    await this.validateLogOwnership(userIdToValidate, campIdToValidate, sessionIdToValidate);
    return await this.repository.update(id, data);
  }

  async deleteLog(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
