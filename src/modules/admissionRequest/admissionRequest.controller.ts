import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AdmissionRequestService } from './admissionRequest.service';
import type { AdmissionRequestStatus, CreateAdmissionRequestDTO, UpdateAdmissionRequestDTO } from './admissionRequest.model';

@Controller('admission-requests')
export class AdmissionRequestController {
  constructor(private readonly service: AdmissionRequestService) {}

  @Post()
  async createRequest(@Body() body: CreateAdmissionRequestDTO) {
    try {
      const request = await this.service.createRequest(body);
      return {
        success: true,
        data: request,
        message: 'Request created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating request');
    }
  }

  @Get(':id')
  async getRequestById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    try {
      const request = await this.service.getRequestById(id);
      return {
        success: true,
        data: request,
      };
    } catch (error) {
      throw new NotFoundException(error instanceof Error ? error.message : 'Request not found');
    }
  }

  @Get()
  async getAllRequests(
    @Query('campamentoId') campamentoId?: string,
    @Query('estado') estado?: AdmissionRequestStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campamentoId?: string;
        estado?: AdmissionRequestStatus;
        page?: number;
        limit?: number;
      } = {};

      if (campamentoId) filters.campamentoId = campamentoId;
      if (estado) filters.estado = estado;
      if (page) filters.page = Number.parseInt(page, 10);
      if (limit) filters.limit = Number.parseInt(limit, 10);

      const result = await this.service.getAllRequests(filters);
      const resolvedPage = filters.page || 1;
      const resolvedLimit = filters.limit || 10;

      return {
        success: true,
        data: result.data,
        pagination: {
          page: resolvedPage,
          limit: resolvedLimit,
          total: result.total,
          pages: Math.ceil(result.total / resolvedLimit),
        },
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error getting requests');
    }
  }

  @Put(':id')
  async updateRequest(@Param('id') id: string, @Body() body: UpdateAdmissionRequestDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    try {
      const request = await this.service.updateRequest(id, body);
      return {
        success: true,
        data: request,
        message: 'Request updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error updating request');
    }
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    try {
      await this.service.deleteRequest(id);
      return {
        success: true,
        message: 'Request deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error deleting request');
    }
  }

  @Post(':id/process-ai')
  async processWithAI(
    @Param('id') id: string,
    @Body() body: { oficioSugeridoId: string; decision: 'ACCEPT' | 'REJECT' },
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const { oficioSugeridoId, decision } = body;
    if (!oficioSugeridoId || !decision) {
      throw new BadRequestException('Missing oficioSugeridoId or decision');
    }

    try {
      const request = await this.service.processWithAI(id, oficioSugeridoId, decision);
      return {
        success: true,
        data: request,
        message: `Request processed by AI: ${decision}`,
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error processing with AI');
    }
  }

  @Post(':id/review')
  async reviewByAdmin(
    @Param('id') id: string,
    @Body() body: { adminUserId: string; approved: boolean; motivoRechazo?: string },
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const { adminUserId, approved, motivoRechazo } = body;
    if (!adminUserId || approved === undefined) {
      throw new BadRequestException('Missing adminUserId or approved');
    }

    try {
      const request = await this.service.reviewByAdmin(id, adminUserId, approved, motivoRechazo);
      return {
        success: true,
        data: request,
        message: `Request ${approved ? 'approved' : 'rejected'} by admin`,
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error in admin review');
    }
  }

  @Get('camps/:campamentoId/pending')
  async getPendingByCamp(@Param('campamentoId') campamentoId: string) {
    if (!campamentoId) throw new BadRequestException('Invalid camp ID');

    try {
      const requests = await this.service.getPendingByCamp(campamentoId);
      return {
        success: true,
        data: requests,
        count: requests.length,
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error getting pending requests');
    }
  }
}