import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AiAdmissionReportRepository } from './aiAdmissionReport.repository';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import type {
  AiAdmissionReport,
  AiDecision,
  CreateAiAdmissionReportDTO,
  UpdateAiAdmissionReportDTO,
} from './aiAdmissionReport.model';

@Injectable()
export class AiAdmissionReportService {
  constructor(
    private readonly repository: AiAdmissionReportRepository,
    @InjectRepository(AdmissionRequestEntity)
    private readonly admissionRequestRepo: Repository<AdmissionRequestEntity>,
  ) {}

  async createReport(data: CreateAiAdmissionReportDTO): Promise<AiAdmissionReport> {
    const admissionRequestExists = await this.admissionRequestRepo.exist({
      where: { id: data.requestId },
    });

    if (!admissionRequestExists) {
      throw new Error('Admission request not found');
    }

    const existing = await this.repository.findByRequestId(data.requestId);
    if (existing) {
      throw new Error('An AI admission report already exists for this request');
    }

    return await this.repository.create(data);
  }

  async getReportById(id: number): Promise<AiAdmissionReport | null> {
    return await this.repository.findById(id);
  }

  async getReportByRequestId(requestId: number): Promise<AiAdmissionReport | null> {
    return await this.repository.findByRequestId(requestId);
  }

  async getAllReports(filters?: {
    requestId?: number;
    aiDecision?: AiDecision;
    suggestedOccupationId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: AiAdmissionReport[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      aiDecision?: AiDecision;
      suggestedOccupationId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.aiDecision !== undefined) repoFilters.aiDecision = filters.aiDecision;
    if (filters?.suggestedOccupationId !== undefined) {
      repoFilters.suggestedOccupationId = filters.suggestedOccupationId;
    }

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateReport(
    id: number,
    data: UpdateAiAdmissionReportDTO,
  ): Promise<AiAdmissionReport | null> {
    return await this.repository.update(id, data);
  }

  async deleteReport(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
