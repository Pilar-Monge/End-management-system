import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { OccupationEntity } from '../occupation/occupation.entity';
import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
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

  async findExpeditionById(id: number): Promise<ExpeditionEntity | null> {
    return await this.repo.manager.getRepository(ExpeditionEntity).findOne({ where: { id } });
  }

  async findExpeditionSummaryById(
    id: number,
  ): Promise<Pick<ExpeditionEntity, 'id' | 'campId' | 'name' | 'status'> | null> {
    return await this.repo.manager.getRepository(ExpeditionEntity).findOne({
      where: { id },
      select: {
        id: true,
        campId: true,
        name: true,
        status: true,
      },
    });
  }

  async findPersonById(id: number): Promise<PersonEntity | null> {
    return await this.repo.manager.getRepository(PersonEntity).findOne({ where: { id } });
  }

  async findOccupationById(
    id: number,
  ): Promise<Pick<OccupationEntity, 'id' | 'name' | 'participatesInExpeditions'> | null> {
    return await this.repo.manager.getRepository(OccupationEntity).findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        participatesInExpeditions: true,
      },
    });
  }

  async findPersonStatusById(
    id: number,
  ): Promise<Pick<PersonEntity, 'id' | 'currentStatus'> | null> {
    return await this.repo.manager.getRepository(PersonEntity).findOne({
      where: { id },
      select: {
        id: true,
        currentStatus: true,
      },
    });
  }

  async updatePersonStatus(
    id: number,
    currentStatus: PersonEntity['currentStatus'],
  ): Promise<void> {
    await this.repo.manager.getRepository(PersonEntity).update({ id }, { currentStatus });
  }

  async findUserByPersonId(personId: number): Promise<Pick<UserEntity, 'id' | 'campId'> | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({
      where: { personId },
      select: {
        id: true,
        campId: true,
      },
    });
  }

  async findUserByPersonAndCamp(
    personId: number,
    campId: number,
  ): Promise<Pick<UserEntity, 'id'> | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({
      where: { personId, campId },
      select: {
        id: true,
      },
    });
  }

  async findExpeditionCampId(expeditionId: number): Promise<number | null> {
    const expedition = await this.repo.manager.getRepository(ExpeditionEntity).findOne({
      where: { id: expeditionId },
      select: { campId: true },
    });

    return expedition?.campId ?? null;
  }

  async findParticipantCampId(participantId: number): Promise<number | null> {
    const row = await this.repo
      .createQueryBuilder('ep')
      .innerJoin(ExpeditionEntity, 'e', 'e.id = ep.expeditionId')
      .select('e.campId', 'campId')
      .where('ep.id = :participantId', { participantId })
      .getRawOne<{ campId: number }>();

    return row?.campId ?? null;
  }

  async hasActiveParticipationInExpeditionStatuses(
    personId: number,
    statuses: Array<ExpeditionEntity['status']>,
  ): Promise<boolean> {
    if (statuses.length === 0) {
      return false;
    }

    const count = await this.repo
      .createQueryBuilder('ep')
      .innerJoin(ExpeditionEntity, 'e', 'e.id = ep.expeditionId')
      .where('ep.personId = :personId', { personId })
      .andWhere('ep.status = :participantStatus', { participantStatus: 'ACTIVE' })
      .andWhere('e.status IN (:...statuses)', { statuses })
      .getCount();

    return count > 0;
  }

  async getActivePersonIdsByExpedition(expeditionId: number): Promise<number[]> {
    const participants = await this.repo.find({
      where: {
        expeditionId,
        status: 'ACTIVE',
      },
      select: {
        personId: true,
      },
    });

    return [...new Set(participants.map((participant) => participant.personId))];
  }

  async getTrackedExpeditionStatusesByPersonId(
    personId: number,
  ): Promise<Array<ExpeditionEntity['status']>> {
    const rows = await this.repo
      .createQueryBuilder('ep')
      .innerJoin(ExpeditionEntity, 'e', 'e.id = ep.expeditionId')
      .select('e.status', 'status')
      .where('ep.personId = :personId', { personId })
      .andWhere('ep.status = :participantStatus', {
        participantStatus: 'ACTIVE' as ParticipantStatus,
      })
      .andWhere('e.status IN (:...statuses)', { statuses: ['IN_PROGRESS', 'DELAYED', 'LOST'] })
      .getRawMany<{ status: ExpeditionEntity['status'] }>();

    return [...new Set(rows.map((row) => row.status))];
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
