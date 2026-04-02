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

  @Get(':id/ai-features')
  async getAiFeatures(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const features = await this.service.getAiFeaturesByRequestId(parsedId);
      return {
        success: true,
        data: features,
      };
    } catch (error) {
      throw new NotFoundException(error instanceof Error ? error.message : 'Request not found');
    }
  }

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

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const request = await this.service.getRequestById(parsedId);
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
    @Query('campId') campId?: string,
    @Query('estado') estado?: AdmissionRequestStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        estado?: AdmissionRequestStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? campamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid camp ID');
        filters.campId = parsedCampId;
      }
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

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const request = await this.service.updateRequest(parsedId, body);
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

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      await this.service.deleteRequest(parsedId);
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

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const { oficioSugeridoId, decision } = body;
    if (!oficioSugeridoId || !decision) {
      throw new BadRequestException('Missing oficioSugeridoId or decision');
    }

    const parsedOccupationId = Number.parseInt(oficioSugeridoId, 10);
    if (Number.isNaN(parsedOccupationId)) {
      throw new BadRequestException('Invalid oficioSugeridoId');
    }

    try {
      const request = await this.service.processWithAI(parsedId, parsedOccupationId, decision);
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

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const { adminUserId, approved, motivoRechazo } = body;
    if (!adminUserId || approved === undefined) {
      throw new BadRequestException('Missing adminUserId or approved');
    }

    const parsedAdminUserId = Number.parseInt(adminUserId, 10);
    if (Number.isNaN(parsedAdminUserId)) {
      throw new BadRequestException('Invalid adminUserId');
    }

    try {
      const request = await this.service.reviewByAdmin(
        parsedId,
        parsedAdminUserId,
        approved,
        motivoRechazo,
      );
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

    const parsedCampId = Number.parseInt(campamentoId, 10);
    if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid camp ID');

    try {
      const requests = await this.service.getPendingByCamp(parsedCampId);
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