import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

import { UserEntity } from '../systemUser/systemUser.entity';
import { PersonEntity } from '../person/person.entity';
import { TransferPersonEntity } from './transferPerson.entity';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  TransferPerson,
  UpdateTransferPersonDTO,
} from './transferPerson.model';

@Injectable()
export class TransferPersonRepository {
  constructor(
    @InjectRepository(TransferPersonEntity)
    private readonly repo: Repository<TransferPersonEntity>,
  ) {}

  async create(data: CreateTransferPersonDTO): Promise<TransferPerson> {
    const entity = this.repo.create({
      transferId: data.transferId,
      personId: data.personId,
      status: data.status ?? 'CONFIRMED',
      departureDate: data.departureDate ?? null,
      arrivalDate: data.arrivalDate ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<TransferPerson | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByTransferAndPerson(
    transferId: number,
    personId: number,
  ): Promise<TransferPerson | null> {
    return await this.repo.findOne({ where: { transferId, personId } });
  }

  async countByTransferId(transferId: number): Promise<number> {
    return await this.repo.count({ where: { transferId } });
  }

  async findEligiblePersonIdsByCampAndOccupation(
    campId: number,
    occupationId: number,
  ): Promise<number[]> {
    const rows = (await this.repo.query(
      `SELECT p.id
       FROM public.person p
       WHERE p.camp_id = $1
         AND p.occupation_id = $2
         AND p.current_status = 'ACTIVE'
         AND NOT EXISTS (
           SELECT 1
           FROM public.transfer_person tp
           JOIN public.transfer t ON t.id = tp.transfer_id
           WHERE tp.person_id = p.id
             AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
         )
         AND NOT EXISTS (
           SELECT 1
           FROM public.transfer_requested_person trp
           JOIN public.transfer t ON t.id = trp.transfer_id
           WHERE trp.person_id = p.id
             AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
         )
       ORDER BY p.created_at ASC, p.id ASC`,
      [campId, occupationId],
    )) as Array<{ id: number }>;

    return rows.map((row) => row.id);
  }

  async findEligiblePersonIdsByCampAndOccupationForUpdate(
    queryRunner: QueryRunner,
    campId: number,
    occupationId: number,
  ): Promise<number[]> {
    const rows = (await queryRunner.query(
      `SELECT p.id
       FROM public.person p
       WHERE p.camp_id = $1
         AND p.occupation_id = $2
         AND p.current_status = 'ACTIVE'
         AND NOT EXISTS (
           SELECT 1
           FROM public.transfer_person tp
           JOIN public.transfer t ON t.id = tp.transfer_id
           WHERE tp.person_id = p.id
             AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
         )
         AND NOT EXISTS (
           SELECT 1
           FROM public.transfer_requested_person trp
           JOIN public.transfer t ON t.id = trp.transfer_id
           WHERE trp.person_id = p.id
             AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
         )
       ORDER BY p.created_at ASC, p.id ASC
       FOR UPDATE SKIP LOCKED`,
      [campId, occupationId],
    )) as Array<{ id: number }>;

    return rows.map((row) => row.id);
  }

  async insertTransferPersonWithQueryRunner(
    queryRunner: QueryRunner,
    transferId: number,
    personId: number,
    status: PersonTransferStatus,
  ): Promise<TransferPerson> {
    const insertRes = await queryRunner.query(
      `INSERT INTO public.transfer_person (transfer_id, person_id, status, departure_date, arrival_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, transfer_id AS "transferId", person_id AS "personId", status, departure_date AS "departureDate", arrival_date AS "arrivalDate"`,
      [transferId, personId, status, null, null],
    );

    return insertRes[0] as unknown as TransferPerson;
  }

  async findPeopleByIds(personIds: number[]): Promise<PersonEntity[]> {
    if (personIds.length === 0) {
      return [];
    }

    return await this.repo.manager.getRepository(PersonEntity).find({
      where: personIds.map((id) => ({ id })),
      order: { id: 'ASC' },
    });
  }

  async findActiveTransferAssignmentsByPersonIds(
    personIds: number[],
    excludedTransferId: number,
  ): Promise<number[]> {
    if (personIds.length === 0) {
      return [];
    }

    const rows = (await this.repo.query(
      `SELECT DISTINCT assigned.person_id
       FROM (
         SELECT tp.person_id
         FROM public.transfer_person tp
         INNER JOIN public.transfer t ON t.id = tp.transfer_id
         WHERE tp.person_id = ANY($1::int[])
           AND tp.transfer_id <> $2
           AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
         UNION
         SELECT trp.person_id
         FROM public.transfer_requested_person trp
         INNER JOIN public.transfer t ON t.id = trp.transfer_id
         WHERE trp.person_id = ANY($1::int[])
           AND trp.transfer_id <> $2
           AND t.status IN ('PENDING_DEPARTURE', 'IN_TRANSIT')
       ) assigned`,
      [personIds, excludedTransferId],
    )) as Array<{ person_id: number }>;

    return rows.map((row) => row.person_id);
  }

  async resolveTransferScope(transferId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  } | null> {
    const rows = (await this.repo.query(
      `SELECT r.origin_camp_id, r.destination_camp_id
       FROM public.transfer t
       JOIN public.intercamp_request r ON r.id = t.request_id
       WHERE t.id = $1
       LIMIT 1`,
      [transferId],
    )) as Array<{ origin_camp_id: number; destination_camp_id: number }>;

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      originCampId: row.origin_camp_id,
      destinationCampId: row.destination_camp_id,
    };
  }

  async resolveTransferPersonScope(transferPersonId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  } | null> {
    const rows = (await this.repo.query(
      `SELECT r.origin_camp_id, r.destination_camp_id
       FROM public.transfer_person tp
       JOIN public.transfer t ON t.id = tp.transfer_id
       JOIN public.intercamp_request r ON r.id = t.request_id
       WHERE tp.id = $1
       LIMIT 1`,
      [transferPersonId],
    )) as Array<{ origin_camp_id: number; destination_camp_id: number }>;

    const row = rows[0];
    if (!row) return null;

    return {
      originCampId: row.origin_camp_id,
      destinationCampId: row.destination_camp_id,
    };
  }

  async findLinkedUserByPersonId(
    personId: number,
  ): Promise<Pick<UserEntity, 'id' | 'campId'> | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({
      where: {
        personId,
      },
      select: {
        id: true,
        campId: true,
      },
    });
  }

  async findAllAndCount(filters?: {
    transferId?: number;
    personId?: number;
    status?: PersonTransferStatus;
    offset?: number;
    limit?: number;
  }): Promise<{ data: TransferPerson[]; total: number }> {
    const qb = this.repo.createQueryBuilder('p');

    if (filters?.transferId !== undefined) {
      qb.andWhere('p.transferId = :transferId', { transferId: filters.transferId });
    }

    if (filters?.personId !== undefined) {
      qb.andWhere('p.personId = :personId', { personId: filters.personId });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('p.status = :status', { status: filters.status });
    }

    qb.orderBy('p.id', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateTransferPersonDTO): Promise<TransferPerson | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<TransferPersonEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
