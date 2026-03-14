import { Injectable } from '@nestjs/common';

import { AccessLogRepository } from './accessLog.repository';
import type {
  AccessLog,
  AccessLogEventType,
  CreateAccessLogDTO,
  UpdateAccessLogDTO,
} from './accessLog.model';

@Injectable()
export class AccessLogService {
  constructor(private readonly repository: AccessLogRepository) {}

  async createLog(data: CreateAccessLogDTO): Promise<AccessLog> {
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
    return await this.repository.update(id, data);
  }

  async deleteLog(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
