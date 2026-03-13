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
    const existingRequest = await this.repository.findByEmail(data.correo);
    
    if (existingRequest) {
      throw new Error('A request with this email already exists');
    }

    return await this.repository.create(data);
  }

  async getRequestById(id: string): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }
    
    return request;
  }

  async getAllRequests(filters?: {
    campamentoId?: string;
    estado?: AdmissionRequestStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: AdmissionRequest[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const findAllFilters: {
      campamentoId?: string;
      estado?: AdmissionRequestStatus;
      limit: number;
      offset: number;
    } = {
      limit,
      offset
    };

    if (filters?.campamentoId !== undefined) {
      findAllFilters.campamentoId = filters.campamentoId;
    }

    if (filters?.estado !== undefined) {
      findAllFilters.estado = filters.estado;
    }

    const data = await this.repository.findAll(findAllFilters);

    let total = 0;
    if (filters?.campamentoId && filters?.estado) {
      total = await this.repository.countByCampAndStatus(
        filters.campamentoId, 
        filters.estado
      );
    } else {
      total = data.length;
    }

    return { data, total };
  }

  async updateRequest(id: string, data: UpdateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const existingRequest = await this.repository.findById(id);
    
    if (!existingRequest) {
      throw new Error('Request not found');
    }

    if (data.correo && data.correo !== existingRequest.correo) {
      const requestWithEmail = await this.repository.findByEmail(data.correo);
      if (requestWithEmail && requestWithEmail.id !== id) {
        throw new Error('Another request with this email already exists');
      }
    }

    const updatedRequest = await this.repository.update(id, data);
    
    if (!updatedRequest) {
      throw new Error('Error updating request');
    }
    
    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<void> {
    const existingRequest = await this.repository.findById(id);
    
    if (!existingRequest) {
      throw new Error('Request not found');
    }

    if (existingRequest.estado === AdmissionRequestStatus.APROBADA) {
      throw new Error('Cannot delete an approved request');
    }

    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new Error('Error deleting request');
    }
  }

  async processWithAI(id: string, oficioSugeridoId: string, decision: 'ACCEPT' | 'REJECT'): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.estado !== AdmissionRequestStatus.PENDIENTE_IA) {
      throw new Error('This request is not pending AI analysis');
    }

    const updateData: UpdateAdmissionRequestDTO = {
      oficioSugeridoId,
      estado: decision === 'ACCEPT' 
        ? AdmissionRequestStatus.PENDIENTE_ADMIN 
        : AdmissionRequestStatus.RECHAZADA
    };

    const updatedRequest = await this.repository.update(id, updateData);
    
    if (!updatedRequest) {
      throw new Error('Error processing request with AI');
    }
    
    return updatedRequest;
  }

  async reviewByAdmin(
    id: string, 
    adminUserId: string, 
    approved: boolean, 
    rejectionReason?: string
  ): Promise<AdmissionRequest> {
    const request = await this.repository.findById(id);
    
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.estado !== AdmissionRequestStatus.PENDIENTE_ADMIN) {
      throw new Error('This request is not pending admin review');
    }

    const updateData: UpdateAdmissionRequestDTO = {
      revisadoPor: adminUserId,
      fechaRevision: new Date(),
      estado: approved ? AdmissionRequestStatus.APROBADA : AdmissionRequestStatus.RECHAZADA,
      motivoRechazo: approved ? null : (rejectionReason || 'Request rejected')
    };

    const updatedRequest = await this.repository.update(id, updateData);
    
    if (!updatedRequest) {
      throw new Error('Error reviewing request');
    }
    
    return updatedRequest;
  }

  async getPendingByCamp(campamentoId: string): Promise<AdmissionRequest[]> {
    return await this.repository.findAll({
      campamentoId,
      estado: AdmissionRequestStatus.PENDIENTE_ADMIN
    });
  }
}