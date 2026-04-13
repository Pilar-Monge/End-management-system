import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccessLogEntity } from '../modules/accessLog/accessLog.entity';
import type { AccessLogEventType } from '../modules/accessLog/accessLog.model';
import { CampEntity } from '../modules/camp/camp.entity';
import { SessionEntity } from '../modules/session/session.entity';
import type { SessionStatus } from '../modules/session/session.model';
import { PasswordResetTokenEntity } from './passwordResetToken.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    @InjectRepository(AccessLogEntity)
    private readonly accessLogRepo: Repository<AccessLogEntity>,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly passwordResetTokenRepo: Repository<PasswordResetTokenEntity>,
  ) {}

  async createSession(data: {
    token: string;
    userId: number;
    campId: number;
    startDate?: Date;
    lastActivityDate?: Date;
    expirationDate: Date;
    sourceIp?: string | null;
    status?: SessionStatus;
  }): Promise<SessionEntity> {
    const entity = this.sessionRepo.create({
      token: data.token,
      userId: data.userId,
      campId: data.campId,
      startDate: data.startDate ?? new Date(),
      lastActivityDate: data.lastActivityDate ?? new Date(),
      expirationDate: data.expirationDate,
      sourceIp: data.sourceIp ?? null,
      status: data.status ?? 'ACTIVE',
    });

    return await this.sessionRepo.save(entity);
  }

  async findActiveSessionByToken(token: string): Promise<SessionEntity | null> {
    return await this.sessionRepo.findOne({
      where: {
        token,
        status: 'ACTIVE',
      },
    });
  }

  async expireSession(id: number, now?: Date): Promise<void> {
    await this.sessionRepo.update(
      { id },
      {
        status: 'EXPIRED',
        lastActivityDate: now ?? new Date(),
      },
    );
  }

  async closeSession(id: number, now?: Date): Promise<void> {
    await this.sessionRepo.update(
      { id },
      {
        status: 'CLOSED',
        lastActivityDate: now ?? new Date(),
      },
    );
  }

  async updateSessionLastActivity(id: number, now?: Date): Promise<void> {
    await this.sessionRepo.update(
      { id },
      {
        lastActivityDate: now ?? new Date(),
      },
    );
  }

  async createAccessLog(data: {
    sessionId?: number | null;
    userId: number;
    campId: number;
    eventType: AccessLogEventType;
    eventDate?: Date;
    sourceIp?: string | null;
    detail?: string | null;
  }): Promise<AccessLogEntity> {
    const entity = this.accessLogRepo.create({
      sessionId: data.sessionId ?? null,
      userId: data.userId,
      campId: data.campId,
      eventType: data.eventType,
      eventDate: data.eventDate ?? new Date(),
      sourceIp: data.sourceIp ?? null,
      detail: data.detail ?? null,
    });

    return await this.accessLogRepo.save(entity);
  }

  async findCampSessionInactivityMinutes(campId: number): Promise<number> {
    const campRepo = this.sessionRepo.manager.getRepository(CampEntity);
    const camp = await campRepo.findOne({
      where: { id: campId },
      select: ['id', 'sessionInactivityMinutes'],
    });

    if (!camp) {
      throw new Error('Camp not found');
    }

    return camp.sessionInactivityMinutes;
  }

  async invalidateActivePasswordResetTokens(userId: number): Promise<void> {
    await this.passwordResetTokenRepo.update(
      {
        userId,
        status: 'ACTIVE',
      },
      {
        status: 'EXPIRED',
      },
    );
  }

  async createPasswordResetToken(data: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    requestIp?: string | null;
  }): Promise<PasswordResetTokenEntity> {
    const entity = this.passwordResetTokenRepo.create({
      userId: data.userId,
      tokenHash: data.tokenHash,
      status: 'ACTIVE',
      expiresAt: data.expiresAt,
      usedAt: null,
      requestIp: data.requestIp ?? null,
    });

    return await this.passwordResetTokenRepo.save(entity);
  }

  async findActivePasswordResetTokenByHash(
    tokenHash: string,
    now: Date,
  ): Promise<PasswordResetTokenEntity | null> {
    return await this.passwordResetTokenRepo.findOne({
      where: {
        tokenHash,
        status: 'ACTIVE',
      },
      order: {
        id: 'DESC',
      },
    }).then(async (token) => {
      if (!token) {
        return null;
      }

      if (token.expiresAt.getTime() <= now.getTime()) {
        token.status = 'EXPIRED';
        await this.passwordResetTokenRepo.save(token);
        return null;
      }

      return token;
    });
  }

  async markPasswordResetTokenUsed(id: number, now: Date): Promise<void> {
    await this.passwordResetTokenRepo.update(
      {
        id,
      },
      {
        status: 'USED',
        usedAt: now,
      },
    );
  }

  async closeActiveSessionsByUser(userId: number, now: Date): Promise<void> {
    await this.sessionRepo.update(
      {
        userId,
        status: 'ACTIVE',
      },
      {
        status: 'CLOSED',
        lastActivityDate: now,
      },
    );
  }
}
