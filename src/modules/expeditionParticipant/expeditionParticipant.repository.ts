import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpeditionParticipantEntity } from './expeditionParticipant.entity';
import type {
  CreateExpeditionParticipantDTO,
  ExpeditionParticipant,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';

@Injectable()
export class ExpeditionParticipantRepository {
  constructor(
    @InjectRepository(ExpeditionParticipantEntity)
    private readonly repo: Repository<ExpeditionParticipantEntity>,
  ) {}

  async create(data: CreateExpeditionParticipantDTO): Promise<ExpeditionParticipant> {
    const entity = this.repo.create({
      expeditionId: data.expeditionId,
      personId: data.personId,
      expeditionRole: data.expeditionRole ?? null,
      status: data.status ?? 'ACTIVE',
      ...(data.assignmentDate !== undefined ? { assignmentDate: data.assignmentDate } : {}),
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<ExpeditionParticipant | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByExpeditionAndPerson(
    expeditionId: number,
    personId: number,
  ): Promise<ExpeditionParticipant | null> {
    return await this.repo.findOne({ where: { expeditionId, personId } });
  }

  async findAllAndCount(filters?: {
    expeditionId?: number;
    personId?: number;
    status?: ParticipantStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: ExpeditionParticipant[]; total: number }> {
    const qb = this.repo.createQueryBuilder('p');

    if (filters?.expeditionId !== undefined) {
      qb.andWhere('p.expeditionId = :expeditionId', { expeditionId: filters.expeditionId });
    }

    if (filters?.personId !== undefined) {
      qb.andWhere('p.personId = :personId', { personId: filters.personId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('p.status = :status', { status: filters.status });
    }

    qb.orderBy('p.assignmentDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(
    id: number,
    data: UpdateExpeditionParticipantDTO,
  ): Promise<ExpeditionParticipant | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<ExpeditionParticipantEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
