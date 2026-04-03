import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionEntity } from './session.entity';
import type { CreateSessionDTO, Session, SessionStatus, UpdateSessionDTO } from './session.model';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repo: Repository<SessionEntity>,
  ) {}

  async create(data: CreateSessionDTO): Promise<Session> {
    const entity = this.repo.create({
      token: data.token,
      userId: data.userId,
      campId: data.campId,
      expirationDate: data.expirationDate,
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.lastActivityDate !== undefined ? { lastActivityDate: data.lastActivityDate } : {}),
      sourceIp: data.sourceIp ?? null,
      ...(data.status !== undefined ? { status: data.status } : {}),
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Session | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByToken(token: string): Promise<Session | null> {
    return await this.repo.findOne({ where: { token } });
  }

  async findAllAndCount(filters?: {
    userId?: number;
    campId?: number;
    status?: SessionStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Session[]; total: number }> {
    const qb = this.repo.createQueryBuilder('s');

    if (filters?.userId !== undefined) {
      qb.andWhere('s.userId = :userId', { userId: filters.userId });
    }

    if (filters?.campId !== undefined) {
      qb.andWhere('s.campId = :campId', { campId: filters.campId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('s.status = :status', { status: filters.status });
    }

    qb.orderBy('s.lastActivityDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateSessionDTO): Promise<Session | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<SessionEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
