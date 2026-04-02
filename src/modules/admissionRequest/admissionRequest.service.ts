import { Injectable } from '@nestjs/common';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import {
  CreateAdmissionRequestDTO,
  UpdateAdmissionRequestDTO,
  AdmissionRequest,
  AdmissionRequestStatus
} from './admissionRequest.model';
import {
  buildAdmissionFeatures,
  type AdmissionFeatureVector,
} from './admissionFeatures.util';

@Injectable()
export class AdmissionRequestService {
  private repository: AdmissionRequestRepository;

  constructor(repository: AdmissionRequestRepository) {
    this.repository = repository;
  }

  async createRequest(data: CreateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const existingRequest = await this.repository.findByEmail(data.email);
    
    if (existingRequest) {
      throw new Error('A request with this email already exists');
    }

    const normalizedData = this.normalizeAiFieldsForCreate(data);
    return await this.repository.create(normalizedData);
  }

  async getRequestById(id: number): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }
    
    return request;
  }

  async getAllRequests(filters?: {
    campId?: number;
    estado?: AdmissionRequestStatus;
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
      offset
    };

    if (filters?.campId !== undefined) {
      findAllFilters.campId = filters.campId;
    }

    if (filters?.estado !== undefined) {
      findAllFilters.status = filters.estado;
    }

    const data = await this.repository.findAll(findAllFilters);

    let total = 0;
    if (filters?.campId && filters?.estado) {
      total = await this.repository.countByCampAndStatus(
        filters.campId, 
        filters.estado
      );
    } else {
      total = data.length;
    }

    return { data, total };
  }

  async updateRequest(id: number, data: UpdateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const existingRequest = await this.repository.findById(id);
    
    if (!existingRequest) {
      throw new Error('Request not found');
    }

    if (data.email && data.email !== existingRequest.email) {
      const requestWithEmail = await this.repository.findByEmail(data.email);
      if (requestWithEmail && requestWithEmail.id !== existingRequest.id) {
        throw new Error('Another request with this email already exists');
      }
    }

    const normalizedData = this.normalizeAiFieldsForUpdate(data, existingRequest);
    const updatedRequest = await this.repository.update(id, normalizedData);
    
    if (!updatedRequest) {
      throw new Error('Error updating request');
    }
    
    return updatedRequest;
  }

  async deleteRequest(id: number): Promise<void> {
    const existingRequest = await this.repository.findById(id);
    
    if (!existingRequest) {
      throw new Error('Request not found');
    }

    if (existingRequest.status === 'APPROVED') {
      throw new Error('Cannot delete an approved request');
    }

    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new Error('Error deleting request');
    }
  }

  async processWithAI(
    id: number,
    suggestedOccupationId: number,
    decision: 'ACCEPT' | 'REJECT',
  ): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'PENDING_AI') {
      throw new Error('This request is not pending AI analysis');
    }

    const updateData: UpdateAdmissionRequestDTO = {
      suggestedOccupationId,
      status: decision === 'ACCEPT' 
        ? 'PENDING_ADMIN' 
        : 'REJECTED'
    };

    const updatedRequest = await this.repository.update(id, updateData);
    
    if (!updatedRequest) {
      throw new Error('Error processing request with AI');
    }
    
    return updatedRequest;
  }

  async reviewByAdmin(
    id: number, 
    adminUserId: number, 
    approved: boolean, 
    rejectionReason?: string
  ): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'PENDING_ADMIN') {
      throw new Error('This request is not pending admin review');
    }

    const updateData: UpdateAdmissionRequestDTO = {
      reviewedBy: adminUserId,
      reviewDate: new Date(),
      status: approved ? 'APPROVED' : 'REJECTED',
      rejectionReason: approved ? null : (rejectionReason || 'Request rejected')
    };

    const updatedRequest = await this.repository.update(id, updateData);
    
    if (!updatedRequest) {
      throw new Error('Error reviewing request');
    }
    
    return updatedRequest;
  }

  async getPendingByCamp(campId: number): Promise<AdmissionRequest[]> {
    return await this.repository.findAll({
      campId,
      status: 'PENDING_ADMIN'
    });
  }

  async getAiFeaturesByRequestId(id: number): Promise<AdmissionFeatureVector> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error('Request not found');
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
      physicalConditionScore:
        data.physicalConditionScore ?? features.physical_condition_score,
      experienceYears: data.experienceYears ?? features.experience_years,
      skillsScore: data.skillsScore ?? features.skills_score,
    };
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
      physicalConditionScore:
        data.physicalConditionScore ?? existingRequest.physicalConditionScore,
      experienceYears: data.experienceYears ?? existingRequest.experienceYears,
      skillsScore: data.skillsScore ?? existingRequest.skillsScore,
    };

    const features = buildAdmissionFeatures(mergedForFeatures);

    return {
      ...data,
      healthLevelScore: data.healthLevelScore ?? features.health_level_score,
      physicalConditionScore:
        data.physicalConditionScore ?? features.physical_condition_score,
      experienceYears: data.experienceYears ?? features.experience_years,
      skillsScore: data.skillsScore ?? features.skills_score,
    };
  }
}