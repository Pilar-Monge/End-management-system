import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { OccupationEntity } from '../occupation/occupation.entity';
import { AI_DECISION_VALUES } from '../aiAdmissionReport/aiAdmissionReport.model';
import { NotificationService } from '../notification/notification.service';
import { UserEntity } from '../systemUser/systemUser.entity';
import { DecisionTreeService } from '../decisionTree/decisionTree.service';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import {
  CreateAdmissionRequestDTO,
  UpdateAdmissionRequestDTO,
  AdmissionRequest,
  AdmissionRequestStatus,
} from './admissionRequest.model';
import { buildAdmissionFeatures, type AdmissionFeatureVector } from './admissionFeatures.util';

const ADMISSION_MODEL_NAME = 'admission-acceptance-v1';

@Injectable()
export class AdmissionRequestService {
  private repository: AdmissionRequestRepository;

  constructor(
    repository: AdmissionRequestRepository,
    private readonly dataSource: DataSource,
    private readonly decisionTreeService: DecisionTreeService,
    private readonly notificationService: NotificationService,
  ) {
    this.repository = repository;
  }

  async createRequest(data: CreateAdmissionRequestDTO): Promise<AdmissionRequest> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');

    const existingRequest = await this.repository.findByEmail(data.email);

    if (existingRequest) {
      throw new Error('Ya existe una solicitud con este correo');
    }

    const normalizedData = this.normalizeAiFieldsForCreate(data);
    const createdRequest = await this.repository.create(normalizedData);
    await this.notifyInitialAdmissionRequest(createdRequest.id, createdRequest.campId, createdRequest.email);

    try {
      const features = buildAdmissionFeatures(normalizedData);
      const aiExplain = await this.decisionTreeService.explainByModelName(ADMISSION_MODEL_NAME, {
        age_years: features.age_years,
        health_level_score: features.health_level_score,
        physical_condition_score: features.physical_condition_score,
        experience_years: features.experience_years,
        skills_score: features.skills_score,
      }, createdRequest.campId);

      const mappedOccupationName = aiExplain.roleAssignment.mappedOccupationName;
      const assignedOccupation = await this.repository.findOccupationByName(mappedOccupationName);

      const aiDecision = this.normalizeAiDecision(aiExplain.prediction);

      const updatedByAi = await this.repository.update(createdRequest.id, {
        status: 'PENDING_ADMIN',
        suggestedOccupationId: assignedOccupation?.id ?? null,
      });

      await this.repository.saveAiAdmissionReport({
        requestId: createdRequest.id,
        submittedData: {
          features,
        },
        aiResponse: {
          admission: {
            prediction: aiExplain.prediction,
            rules: aiExplain.rules,
            summary: aiExplain.explanation.admissionSummary,
            reason: aiExplain.explanation.admissionReason,
          },
          roleAssignment: {
            suggestedRole: aiExplain.roleAssignment.suggestedRole,
            mappedOccupationName,
            suggestedOccupationId: assignedOccupation?.id ?? null,
            rules: aiExplain.roleAssignment.rules,
            summary: aiExplain.roleAssignment.summary,
            reason: aiExplain.roleAssignment.reason,
            recommendedAttributes: aiExplain.roleAssignment.recommendedAttributes,
          },
        },
        aiDecision,
        aiJustification: aiExplain.explanation.admissionReason,
        suggestedOccupationId: assignedOccupation?.id ?? null,
      });

      if (updatedByAi) {
        await this.notifyAiReviewResult(updatedByAi.id, updatedByAi.campId, updatedByAi.email, updatedByAi.status);
        return updatedByAi;
      }
    } catch {
      // If auto-recommendation fails, keep the request in PENDING_AI for manual fallback.
    }

    return createdRequest;
  }

  async getRequestById(id: number): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    return request;
  }

  async getAllRequests(filters?: {
    campId?: number;
    status?: AdmissionRequestStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: AdmissionRequest[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const findAllFilters: {
      campId?: number;
      status?: AdmissionRequestStatus;
      limit: number;
      offset: number;
    } = {
      limit,
      offset,
    };

    if (filters?.campId !== undefined) {
      findAllFilters.campId = filters.campId;
    }

    if (filters?.status !== undefined) {
      findAllFilters.status = filters.status;
    }

    const data = await this.repository.findAll(findAllFilters);

    let total = 0;
    if (filters?.campId && filters?.status) {
      total = await this.repository.countByCampAndStatus(filters.campId, filters.status);
    } else {
      total = data.length;
    }

    return { data, total };
  }

  async updateRequest(id: number, data: UpdateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const existingRequest = await this.repository.findById(id);

    if (!existingRequest) {
      throw new Error('Solicitud no encontrada');
    }

    if (data.email && data.email !== existingRequest.email) {
      const requestWithEmail = await this.repository.findByEmail(data.email);
      if (requestWithEmail && requestWithEmail.id !== existingRequest.id) {
        throw new Error('Ya existe otra solicitud con este correo');
      }
    }

    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }

    if (data.suggestedOccupationId !== undefined && data.suggestedOccupationId !== null) {
      await assertEntityExists(
        this.dataSource,
        OccupationEntity,
        data.suggestedOccupationId,
        'Occupation',
      );
    }

    if (data.finalOccupationId !== undefined && data.finalOccupationId !== null) {
      await assertEntityExists(
        this.dataSource,
        OccupationEntity,
        data.finalOccupationId,
        'Occupation',
      );
    }

    if (data.reviewedBy !== undefined && data.reviewedBy !== null) {
      await assertEntityExists(this.dataSource, UserEntity, data.reviewedBy, 'User');
    }

    const updatedRequest = await this.repository.update(id, data);
    if (!updatedRequest) {
      throw new Error('Error al actualizar la solicitud');
    }

    return updatedRequest;
  }

  async deleteRequest(id: number): Promise<void> {
    const existingRequest = await this.repository.findById(id);

    if (!existingRequest) {
      throw new Error('Solicitud no encontrada');
    }

    if (existingRequest.status === 'APPROVED') {
      throw new Error('No se puede eliminar una solicitud aprobada');
    }

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error('Error al eliminar la solicitud');
    }
  }

  async processWithAI(
    id: number,
    suggestedOccupationId: number,
    decision: 'ACCEPT' | 'REJECT',
  ): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    if (request.status !== 'PENDING_AI') {
      throw new Error('Esta solicitud no esta pendiente de analisis de IA');
    }

    await assertEntityExists(
      this.dataSource,
      OccupationEntity,
      suggestedOccupationId,
      'Occupation',
    );

    const updateData: UpdateAdmissionRequestDTO = {
      suggestedOccupationId,
      status: decision === 'ACCEPT' ? 'PENDING_ADMIN' : 'REJECTED',
    };

    const updatedRequest = await this.repository.update(id, updateData);

    if (!updatedRequest) {
      throw new Error('Error al procesar la solicitud con IA');
    }

    await this.notifyAiReviewResult(updatedRequest.id, updatedRequest.campId, updatedRequest.email, updatedRequest.status);

    return updatedRequest;
  }

  async reviewByAdmin(
    id: number,
    adminUserId: number,
    approved: boolean,
    rejectionReason?: string,
  ): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    if (request.status !== 'PENDING_ADMIN') {
      throw new Error('Esta solicitud no esta pendiente de revision administrativa');
    }

    await assertEntityExists(this.dataSource, UserEntity, adminUserId, 'User');

    const assignedOccupationIdOnApproval = approved
      ? (request.finalOccupationId ?? request.suggestedOccupationId ?? null)
      : null;

    const updateData: UpdateAdmissionRequestDTO = {
      reviewedBy: adminUserId,
      reviewDate: new Date(),
      status: approved ? 'APPROVED' : 'REJECTED',
      finalOccupationId: assignedOccupationIdOnApproval,
      rejectionReason: approved ? null : rejectionReason || 'Solicitud rechazada',
    };

    const updatedRequest = await this.repository.update(id, updateData);

    if (!updatedRequest) {
      throw new Error('Error al revisar la solicitud');
    }

    await this.notifyAdminReviewResult(
      updatedRequest.id,
      updatedRequest.campId,
      updatedRequest.email,
      approved,
    );

    return updatedRequest;
  }

  async getPendingByCamp(campId: number): Promise<AdmissionRequest[]> {
    return await this.repository.findAll({
      campId,
      status: 'PENDING_ADMIN',
    });
  }

  async getAiFeaturesByRequestId(id: number): Promise<AdmissionFeatureVector> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    return buildAdmissionFeatures({
      name: request.name,
      lastName1: request.lastName1,
      lastName2: request.lastName2,
      email: request.email,
      desiredUsername: request.desiredUsername,
      birthDate: request.birthDate,
      photoUrl: request.photoUrl,
      declaredHealthLevel: request.declaredHealthLevel,
      previousExperience: request.previousExperience,
      physicalCondition: request.physicalCondition,
      declaredSkills: request.declaredSkills,
      healthLevelScore: request.healthLevelScore,
      physicalConditionScore: request.physicalConditionScore,
      experienceYears: request.experienceYears,
      skillsScore: request.skillsScore,
    });
  }

  private normalizeAiFieldsForCreate(data: CreateAdmissionRequestDTO): CreateAdmissionRequestDTO {
    const features = buildAdmissionFeatures(data);

    return {
      ...data,
      healthLevelScore: data.healthLevelScore ?? features.health_level_score,
      physicalConditionScore: data.physicalConditionScore ?? features.physical_condition_score,
      experienceYears: data.experienceYears ?? features.experience_years,
      skillsScore: data.skillsScore ?? features.skills_score,
    };
  }

  private normalizeAiDecision(prediction: string): (typeof AI_DECISION_VALUES)[number] {
    if (prediction === 'ACCEPT') {
      return 'ACCEPT';
    }

    if (prediction === 'REJECT') {
      return 'REJECT';
    }

    throw new Error(`Prediccion de admision invalida para el reporte de IA: ${prediction}`);
  }

  private normalizeAiFieldsForUpdate(
    data: UpdateAdmissionRequestDTO,
    existingRequest: AdmissionRequest,
  ): UpdateAdmissionRequestDTO {
    const mergedForFeatures: CreateAdmissionRequestDTO = {
      name: data.name ?? existingRequest.name,
      lastName1: data.lastName1 ?? existingRequest.lastName1,
      lastName2: data.lastName2 ?? existingRequest.lastName2,
      email: data.email ?? existingRequest.email,
      desiredUsername: data.desiredUsername ?? existingRequest.desiredUsername,
      birthDate: data.birthDate ?? existingRequest.birthDate,
      gender: data.gender ?? existingRequest.gender,
      photoUrl: data.photoUrl ?? existingRequest.photoUrl,
      declaredHealthLevel: data.declaredHealthLevel ?? existingRequest.declaredHealthLevel,
      previousExperience: data.previousExperience ?? existingRequest.previousExperience,
      physicalCondition: data.physicalCondition ?? existingRequest.physicalCondition,
      declaredSkills: data.declaredSkills ?? existingRequest.declaredSkills,
      campId: data.campId ?? existingRequest.campId,
      healthLevelScore: data.healthLevelScore ?? existingRequest.healthLevelScore,
      physicalConditionScore: data.physicalConditionScore ?? existingRequest.physicalConditionScore,
      experienceYears: data.experienceYears ?? existingRequest.experienceYears,
      skillsScore: data.skillsScore ?? existingRequest.skillsScore,
    };

    const features = buildAdmissionFeatures(mergedForFeatures);

    return {
      ...data,
      healthLevelScore: data.healthLevelScore ?? features.health_level_score,
      physicalConditionScore: data.physicalConditionScore ?? features.physical_condition_score,
      experienceYears: data.experienceYears ?? features.experience_years,
      skillsScore: data.skillsScore ?? features.skills_score,
    };
  }

  private async notifyInitialAdmissionRequest(
    requestId: number,
    campId: number,
    applicantEmail: string,
  ): Promise<void> {
    await this.notificationService.notifyCampRoles(campId, ['SYSTEM_ADMIN'], {
      type: 'ADMISSION_REQUEST_PENDING',
      title: 'Nueva solicitud de admision',
      message: `Hay una nueva solicitud de admision pendiente de revision (ID: ${requestId}).`,
      sourceType: 'admission_request',
      sourceId: requestId,
    });

    await this.notificationService.queueEmail({
      toEmail: applicantEmail,
      subject: 'Solicitud de ingreso recibida',
      templateKey: 'generic_notification',
      payload: {
        title: 'Solicitud de ingreso recibida',
        message:
          'Recibimos tu solicitud de ingreso. El proceso iniciara con analisis automatizado y revision administrativa.',
      },
    });
  }

  private async notifyAiReviewResult(
    requestId: number,
    campId: number,
    applicantEmail: string,
    status: AdmissionRequestStatus,
  ): Promise<void> {
    if (status === 'PENDING_ADMIN') {
      await this.notificationService.notifyCampRoles(campId, ['SYSTEM_ADMIN'], {
        type: 'ADMISSION_REQUEST_AI_REVIEWED',
        title: 'Solicitud evaluada por IA',
        message: `La solicitud ${requestId} fue evaluada por IA y esta lista para revision administrativa.`,
        sourceType: 'admission_request',
        sourceId: requestId,
      });

      await this.notificationService.queueEmail({
        toEmail: applicantEmail,
        subject: 'Solicitud en revision administrativa',
        templateKey: 'generic_notification',
        payload: {
          title: 'Solicitud en revision administrativa',
          message:
            'Tu solicitud fue evaluada por IA y ahora esta pendiente de aprobacion por administracion.',
        },
      });
      return;
    }

    if (status === 'REJECTED') {
      await this.notificationService.notifyCampRoles(campId, ['SYSTEM_ADMIN'], {
        type: 'ADMISSION_REQUEST_REJECTED',
        title: 'Solicitud rechazada por evaluacion IA',
        message: `La solicitud ${requestId} fue rechazada durante la evaluacion automatizada.`,
        sourceType: 'admission_request',
        sourceId: requestId,
      });

      await this.notificationService.queueEmail({
        toEmail: applicantEmail,
        subject: 'Solicitud rechazada',
        templateKey: 'admission_request_rejected',
        payload: {
          title: 'Solicitud rechazada',
          message:
            'La evaluacion inicial de tu solicitud resulto en rechazo. Puedes contactar al campamento para mas informacion.',
        },
      });
    }
  }

  private async notifyAdminReviewResult(
    requestId: number,
    campId: number,
    applicantEmail: string,
    approved: boolean,
  ): Promise<void> {
    await this.notificationService.notifyCampRoles(campId, ['SYSTEM_ADMIN'], {
      type: approved ? 'ADMISSION_REQUEST_APPROVED' : 'ADMISSION_REQUEST_REJECTED',
      title: approved ? 'Solicitud de admision aprobada' : 'Solicitud de admision rechazada',
      message: approved
        ? `La solicitud ${requestId} fue aprobada por administracion.`
        : `La solicitud ${requestId} fue rechazada por administracion.`,
      sourceType: 'admission_request',
      sourceId: requestId,
    });

    await this.notificationService.queueEmail({
      toEmail: applicantEmail,
      subject: approved ? 'Solicitud aprobada' : 'Solicitud rechazada',
      templateKey: approved ? 'admission_request_approved' : 'admission_request_rejected',
      payload: {
        title: approved ? 'Solicitud aprobada' : 'Solicitud rechazada',
        message: approved
          ? `Tu solicitud de ingreso (ID: ${requestId}) fue aprobada por administracion.`
          : `Tu solicitud de ingreso (ID: ${requestId}) fue rechazada por administracion.`,
      },
    });
  }
}
