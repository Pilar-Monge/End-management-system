import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampEntity } from '../camp/camp.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { IntercampRequestEntity } from './intercampRequest.entity';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

@Injectable()
export class IntercampRequestRepository {
  constructor(
    @InjectRepository(IntercampRequestEntity)
    private readonly repo: Repository<IntercampRequestEntity>,
  ) {}

  async create(data: CreateIntercampRequestDTO): Promise<IntercampRequest> {
    const entity = this.repo.create({
      originCampId: data.originCampId,
      destinationCampId: data.destinationCampId,
      status: data.status ?? 'DRAFT',
      description: data.description ?? null,
      plannedDepartureDate: data.plannedDepartureDate ?? null,
      plannedArrivalDate: data.plannedArrivalDate ?? null,
      personRequirements: [],
      ...(data.createdDate !== undefined ? { createdDate: data.createdDate } : {}),
      responseDate: data.responseDate ?? null,
      createdBy: data.createdBy,
      respondedBy: data.respondedBy ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<IntercampRequest | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findCampById(id: number): Promise<CampEntity | null> {
    return await this.repo.manager.getRepository(CampEntity).findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.repo.manager.getRepository(UserEntity).findOne({ where: { id } });
  }

  async countTransfersByRequestId(requestId: number): Promise<number> {
    const rows = (await this.repo.query(
      `SELECT COUNT(*)::int AS total FROM public.transfer WHERE request_id = $1`,
      [requestId],
    )) as Array<{ total: number }>;

    return rows[0]?.total ?? 0;
  }

  async countAppliedInventoryByRequestId(requestId: number): Promise<number> {
    const rows = (await this.repo.query(
      `SELECT COUNT(*)::int AS total
       FROM public.inventory_movement
       WHERE source_type = 'intercamp_request'
         AND source_id = $1
         AND movement_type IN ('TRANSFER_SENT', 'TRANSFER_RECEIVED')`,
      [requestId],
    )) as Array<{ total: number }>;

    return rows[0]?.total ?? 0;
  }

  async findCampInventoryAmount(campId: number, resourceTypeId: number): Promise<string> {
    const rows = (await this.repo.query(
      `SELECT COALESCE(current_amount, 0)::text AS total
       FROM public.camp_inventory
       WHERE camp_id = $1
         AND resource_type_id = $2
       LIMIT 1`,
      [campId, resourceTypeId],
    )) as Array<{ total: string }>;

    return rows[0]?.total ?? '0';
  }

  async findCampInventoryWithMinimum(
    campId: number,
    resourceTypeId: number,
  ): Promise<{ current: string; minimum: string }> {
    const rows = (await this.repo.query(
      `SELECT COALESCE(current_amount, 0)::text AS current,
              COALESCE(minimum_alert_amount, 0)::text AS minimum
       FROM public.camp_inventory
       WHERE camp_id = $1
         AND resource_type_id = $2
       LIMIT 1`,
      [campId, resourceTypeId],
    )) as Array<{ current: string; minimum: string }>;

    return {
      current: rows[0]?.current ?? '0',
      minimum: rows[0]?.minimum ?? '0',
    };
  }

  async findCommittedTransferAmountByCampAndResourceType(
    campId: number,
    resourceTypeId: number,
    excludedRequestId?: number,
  ): Promise<string> {
    const params: Array<number> = [campId, resourceTypeId];
    const excludedClause = excludedRequestId === undefined ? '' : ' AND r.id <> $3';

    if (excludedRequestId !== undefined) {
      params.push(excludedRequestId);
    }

    const rows = (await this.repo.query(
      `SELECT COALESCE(SUM(COALESCE(rrd.approved_amount, rrd.requested_amount)), 0)::text AS total
       FROM public.transfer t
       INNER JOIN public.intercamp_request r ON r.id = t.request_id
       INNER JOIN public.request_resource_detail rrd ON rrd.request_id = r.id
       WHERE r.destination_camp_id = $1
         AND rrd.resource_type_id = $2
         AND r.status = 'APPROVED'
         AND t.status = 'PENDING_DEPARTURE'${excludedClause}`,
      params,
    )) as Array<{ total: string }>;

    return rows[0]?.total ?? '0';
  }

  async findRationInventoryCandidate(campId: number): Promise<{
    resourceTypeId: number;
    currentAmount: string;
    minimumAlertAmount: string;
  } | null> {
    const rows = (await this.repo.query(
      `SELECT ci.resource_type_id,
              ci.current_amount::text AS current_amount,
              ci.minimum_alert_amount::text AS minimum_alert_amount
       FROM public.camp_inventory ci
       INNER JOIN public.resource_type rt ON rt.id = ci.resource_type_id
       WHERE ci.camp_id = $1
         AND rt.category = 'FOOD'
       ORDER BY
         CASE
           WHEN LOWER(rt.name) LIKE '%ration%' THEN 0
           WHEN LOWER(rt.name) LIKE '%food%' THEN 1
           ELSE 2
         END,
         ci.resource_type_id ASC
       LIMIT 1`,
      [campId],
    )) as Array<{
      resource_type_id: number;
      current_amount: string;
      minimum_alert_amount: string;
    }>;

    const row = rows[0];
    if (!row) return null;

    return {
      resourceTypeId: row.resource_type_id,
      currentAmount: row.current_amount,
      minimumAlertAmount: row.minimum_alert_amount,
    };
  }

  async findCommittedTransferRationsByCamp(
    campId: number,
    excludedRequestId?: number,
  ): Promise<string> {
    const params: number[] = [campId];
    const excludedClause = excludedRequestId === undefined ? '' : ' AND r.id <> $2';

    if (excludedRequestId !== undefined) {
      params.push(excludedRequestId);
    }

    const rows = (await this.repo.query(
      `SELECT COALESCE(SUM(t.rations_for_trip), 0)::text AS total
       FROM public.transfer t
       INNER JOIN public.intercamp_request r ON r.id = t.request_id
       WHERE r.destination_camp_id = $1
         AND r.status = 'APPROVED'
         AND t.status = 'PENDING_DEPARTURE'${excludedClause}`,
      params,
    )) as Array<{ total: string }>;

    return rows[0]?.total ?? '0';
  }
  async findRequestResourceAmountsByRequestId(
    requestId: number,
  ): Promise<Array<{ resourceTypeId: number; amount: string }>> {
    const rows = (await this.repo.query(
      `SELECT resource_type_id,
              COALESCE(approved_amount, requested_amount)::text AS amount
       FROM public.request_resource_detail
       WHERE request_id = $1
         AND COALESCE(approved_amount, requested_amount) > 0`,
      [requestId],
    )) as Array<{ resource_type_id: number; amount: string }>;

    return rows.map((row) => ({
      resourceTypeId: row.resource_type_id,
      amount: row.amount,
    }));
  }

  async countRequestDetailsByRequestId(requestId: number): Promise<number> {
    const rows = (await this.repo.query(
      `SELECT
          (
            SELECT COUNT(*)::int
            FROM public.request_resource_detail
            WHERE request_id = $1
          ) +
          (
            SELECT COUNT(*)::int
            FROM public.request_person_detail
            WHERE request_id = $1
          ) AS total`,
      [requestId],
    )) as Array<{ total: number }>;

    return rows[0]?.total ?? 0;
  }

  async findPersonDetailRequirementsByRequestId(
    requestId: number,
  ): Promise<Array<{ occupationId: number; quantity: number }>> {
    const rows = (await this.repo.query(
      `SELECT occupation_id, SUM(quantity)::int AS quantity
       FROM (
         SELECT occupation_id, amount AS quantity
         FROM public.request_person_detail
         WHERE request_id = $1
           AND detail_type = 'BY_OCCUPATION'
           AND status <> 'REJECTED'
           AND occupation_id IS NOT NULL
           AND amount > 0
         UNION ALL
         SELECT p.occupation_id, 1 AS quantity
         FROM public.request_person_detail rpd
         INNER JOIN public.person p ON p.id = rpd.person_id
         WHERE rpd.request_id = $1
           AND rpd.detail_type = 'SPECIFIC'
           AND rpd.status <> 'REJECTED'
           AND p.occupation_id IS NOT NULL
       ) requirements
       GROUP BY occupation_id`,
      [requestId],
    )) as Array<{ occupation_id: number; quantity: number }>;

    return rows.map((row) => ({
      occupationId: row.occupation_id,
      quantity: row.quantity,
    }));
  }

  async findAllAndCount(filters?: {
    originCampId?: number;
    destinationCampId?: number;
    involvedCampId?: number;
    status?: IntercampRequestStatus;
    createdBy?: number;
    respondedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: IntercampRequest[]; total: number }> {
    const qb = this.repo.createQueryBuilder('r');

    if (filters?.originCampId !== undefined) {
      qb.andWhere('r.originCampId = :originCampId', {
        originCampId: filters.originCampId,
      });
    }

    if (filters?.destinationCampId !== undefined) {
      qb.andWhere('r.destinationCampId = :destinationCampId', {
        destinationCampId: filters.destinationCampId,
      });
    }

    if (filters?.involvedCampId !== undefined) {
      qb.andWhere('(r.originCampId = :involvedCampId OR r.destinationCampId = :involvedCampId)', {
        involvedCampId: filters.involvedCampId,
      });
    }

    if (filters?.status !== undefined) {
      qb.andWhere('r.status = :status', { status: filters.status });
    }

    if (filters?.createdBy !== undefined) {
      qb.andWhere('r.createdBy = :createdBy', { createdBy: filters.createdBy });
    }

    if (filters?.respondedBy !== undefined) {
      qb.andWhere('r.respondedBy = :respondedBy', {
        respondedBy: filters.respondedBy,
      });
    }

    qb.orderBy('r.createdDate', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateIntercampRequestDTO): Promise<IntercampRequest | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<IntercampRequestEntity>;

    delete cleaned.personRequirements;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}

