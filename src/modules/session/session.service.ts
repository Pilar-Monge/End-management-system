import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { UserEntity } from '../systemUser/systemUser.entity';

import { SessionRepository } from './session.repository';
import type { CreateSessionDTO, Session, SessionStatus, UpdateSessionDTO } from './session.model';

@Injectable()
export class SessionService {
  constructor(
    private readonly repository: SessionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createSession(data: CreateSessionDTO): Promise<Session> {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: data.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    if (user.campId !== data.campId) {
      throw new Error('User does not belong to the provided camp');
    }

    const existing = await this.repository.findByToken(data.token);
    if (existing) {
      throw new Error('A session with this token already exists');
    }

    return await this.repository.create(data);
  }

  async getSessionById(id: number): Promise<Session | null> {
    return await this.repository.findById(id);
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    return await this.repository.findByToken(token);
  }

  async getAllSessions(filters?: {
    userId?: number;
    campId?: number;
    status?: SessionStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Session[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      userId?: number;
      campId?: number;
      status?: SessionStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.userId !== undefined) repoFilters.userId = filters.userId;
    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateSession(id: number, data: UpdateSessionDTO): Promise<Session | null> {
    if (data.userId !== undefined) {
      await assertEntityExists(this.dataSource, UserEntity, data.userId, 'User');
    }

    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }

    return await this.repository.update(id, data);
  }

  async deleteSession(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
