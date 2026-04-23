import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { AiAdmissionReportEntity } from './aiAdmissionReport.entity';
import type {
  AiAdmissionReport,
  AiDecision,
  CreateAiAdmissionReportDTO,
  UpdateAiAdmissionReportDTO,
} from './aiAdmissionReport.model';

@Injectable()
export class AiAdmissionReportRepository {
  constructor(
    @InjectRepository(AiAdmissionReportEntity)
    private readonly repo: Repository<AiAdmissionReportEntity>,
  ) {}

  async create(data: CreateAiAdmissionReportDTO): Promise<AiAdmissionReport> {
    const entity = this.repo.create({
      requestId: data.requestId,
      submittedData: data.submittedData,
      aiResponse: data.aiResponse,
      aiDecision: data.aiDecision,
      aiJustification: data.aiJustification ?? null,
      suggestedOccupationId: data.suggestedOccupationId ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<AiAdmissionReport | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByRequestId(requestId: number): Promise<AiAdmissionReport | null> {
    return await this.repo.findOne({ where: { requestId } });
  }

  async admissionRequestExists(requestId: number): Promise<boolean> {
    return await this.repo.manager.getRepository(AdmissionRequestEntity).exist({
      where: { id: requestId },
    });
  }

  async findAdmissionRequestCampId(requestId: number): Promise<number | null> {
    const request = await this.repo.manager.getRepository(AdmissionRequestEntity).findOne({
      where: { id: requestId },
      select: {
        campId: true,
      },
    });

    return request?.campId ?? null;
  }

  async findAllAndCount(filters?: {
    requestId?: number;
    aiDecision?: AiDecision;
    suggestedOccupationId?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: AiAdmissionReport[]; total: number }> {
    const qb = this.repo.createQueryBuilder('rep');

    if (filters?.requestId !== undefined) {
      qb.andWhere('rep.requestId = :requestId', { requestId: filters.requestId });
    }

    if (filters?.aiDecision !== undefined) {
      qb.andWhere('rep.aiDecision = :aiDecision', { aiDecision: filters.aiDecision });
    }

    if (filters?.suggestedOccupationId !== undefined) {
      qb.andWhere('rep.suggestedOccupationId = :suggestedOccupationId', {
        suggestedOccupationId: filters.suggestedOccupationId,
      });
    }

    qb.orderBy('rep.createdAt', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateAiAdmissionReportDTO): Promise<AiAdmissionReport | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<AiAdmissionReportEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
