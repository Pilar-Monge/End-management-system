import { Injectable } from '@nestjs/common';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import {
  CreateAdmissionRequestDTO,
  UpdateAdmissionRequestDTO,
  AdmissionRequest,
  AdmissionRequestStatus
} from './admissionRequest.model';

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

    return await this.repository.create(data);
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
      offset
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
      total = await this.repository.countByCampAndStatus(
        filters.campId, 
        filters.status
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

    const updatedRequest = await this.repository.update(id, data);
    
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
}