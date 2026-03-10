import { Request, Response } from 'express';
import { AdmissionRequestService } from './admissionRequest.service';
import { CreateAdmissionRequestDTO, UpdateAdmissionRequestDTO, AdmissionRequestStatus } from './admissionRequest.model';

export class AdmissionRequestController {
  private service: AdmissionRequestService;

  constructor(service: AdmissionRequestService) {
    this.service = service;
  }

  createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateAdmissionRequestDTO = req.body;
      const request = await this.service.createRequest(data);
      res.status(201).json({
        success: true,
        data: request,
        message: 'Request created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error creating request'
      });
    }
  };

  getRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
        return;
      }
      const request = await this.service.getRequestById(id);
      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Request not found'
      });
    }
  };

  getAllRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const { campamentoId, estado, page, limit } = req.query;
      
      const filters: any = {};
      
      if (campamentoId) filters.campamentoId = campamentoId as string;
      if (estado) filters.estado = estado as AdmissionRequestStatus;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await this.service.getAllRequests(filters);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: result.total,
          pages: Math.ceil(result.total / (filters.limit || 10))
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error getting requests'
      });
    }
  };

  updateRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
        return;
      }
      const data: UpdateAdmissionRequestDTO = req.body;
      const request = await this.service.updateRequest(id, data);
      res.status(200).json({
        success: true,
        data: request,
        message: 'Request updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error updating request'
      });
    }
  };

  deleteRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
        return;
      }
      await this.service.deleteRequest(id);
      res.status(200).json({
        success: true,
        message: 'Request deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error deleting request'
      });
    }
  };

  processWithAI = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
        return;
      }
      const { oficioSugeridoId, decision } = req.body;
      
      const request = await this.service.processWithAI(id, oficioSugeridoId, decision);
      
      res.status(200).json({
        success: true,
        data: request,
        message: `Request processed by AI: ${decision}`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error processing with AI'
      });
    }
  };

  reviewByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
        return;
      }
      const { adminUserId, approved, motivoRechazo } = req.body;
      
      const request = await this.service.reviewByAdmin(id, adminUserId, approved, motivoRechazo);
      
      res.status(200).json({
        success: true,
        data: request,
        message: `Request ${approved ? 'approved' : 'rejected'} by admin`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error in admin review'
      });
    }
  };

  getPendingByCamp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { campamentoId } = req.params;
      if (!campamentoId || Array.isArray(campamentoId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid camp ID'
        });
        return;
      }
      const requests = await this.service.getPendingByCamp(campamentoId);
      
      res.status(200).json({
        success: true,
        data: requests,
        count: requests.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error getting pending requests'
      });
    }
  };
}