import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AiAdmissionReportRepository } from './aiAdmissionReport.repository';
import { NotificationService } from '../notification/notification.service';
import { OccupationEntity } from '../occupation/occupation.entity';
import { assertEntityExists } from '../../common/validation/assert-exists';
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
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  async createReport(data: CreateAiAdmissionReportDTO): Promise<AiAdmissionReport> {
    const admissionRequestExists = await this.repository.admissionRequestExists(data.requestId);

    if (!admissionRequestExists) {
      throw new Error('Solicitud de admision no encontrada');
    }

    const existing = await this.repository.findByRequestId(data.requestId);
    if (existing) {
      throw new Error('Ya existe un reporte de IA de admision para esta solicitud');
    }

    if (data.suggestedOccupationId !== undefined && data.suggestedOccupationId !== null) {
      await assertEntityExists(
        this.dataSource,
        OccupationEntity,
        data.suggestedOccupationId,
        'Occupation',
      );
    }

    const created = await this.repository.create(data);

    const campId = await this.repository.findAdmissionRequestCampId(data.requestId);

    if (campId !== null) {
      await this.notificationService.notifyCampRoles(campId, ['SYSTEM_ADMIN'], {
        type: 'ADMISSION_REQUEST_AI_REVIEWED',
        title: 'Reporte de IA de admision creado',
        message: `Se creo un reporte de IA para la solicitud ${data.requestId}.`,
        sourceType: 'ai_admission_report',
        sourceId: created.id,
        sendEmail: false,
      });
    }

    return created;
  }

  async getReportById(id: number): Promise<AiAdmissionReport | null> {
    return await this.repository.findById(id);
  }

  async getReportByRequestId(requestId: number): Promise<AiAdmissionReport | null> {
    return await this.repository.findByRequestId(requestId);
  }

  async getReportCampId(reportId: number): Promise<number | null> {
    const report = await this.repository.findById(reportId);
    if (!report) {
      return null;
    }

    const request = await this.admissionRequestRepo.findOne({
      where: { id: report.requestId },
      select: {
        campId: true,
      },
    });

    return request?.campId ?? null;
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
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.requestId !== undefined && data.requestId !== existing.requestId) {
      const admissionRequestExists = await this.repository.admissionRequestExists(data.requestId);

      if (!admissionRequestExists) {
        throw new Error('Solicitud de admision no encontrada');
      }

      const byRequest = await this.repository.findByRequestId(data.requestId);
      if (byRequest && byRequest.id !== id) {
        throw new Error('Ya existe un reporte de IA de admision para esta solicitud');
      }
    }

    if (data.suggestedOccupationId !== undefined && data.suggestedOccupationId !== null) {
      await assertEntityExists(
        this.dataSource,
        OccupationEntity,
        data.suggestedOccupationId,
        'Occupation',
      );
    }
    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    const updateCampId = await this.repository.findAdmissionRequestCampId(updated.requestId);

    if (updateCampId !== null) {
      await this.notificationService.notifyCampRoles(updateCampId, ['SYSTEM_ADMIN'], {
        type: 'ADMISSION_REQUEST_AI_REVIEWED',
        title: 'Reporte de IA de admision actualizado',
        message: `Se actualizo el reporte de IA para la solicitud ${updated.requestId}.`,
        sourceType: 'ai_admission_report',
        sourceId: updated.id,
        sendEmail: false,
      });
    }

    return updated;
  }

  async deleteReport(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    const deleteCampId = await this.repository.findAdmissionRequestCampId(existing.requestId);

    if (deleteCampId !== null) {
      await this.notificationService.notifyCampRoles(deleteCampId, ['SYSTEM_ADMIN'], {
        type: 'ADMISSION_REQUEST_AI_REVIEWED',
        title: 'Reporte de IA de admision eliminado',
        message: `Se elimino el reporte de IA para la solicitud ${existing.requestId}.`,
        sourceType: 'ai_admission_report',
        sourceId: existing.id,
        sendEmail: false,
      });
    }

    return true;
  }
}
