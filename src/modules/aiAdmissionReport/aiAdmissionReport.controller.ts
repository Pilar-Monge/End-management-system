import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { AiAdmissionReportService } from './aiAdmissionReport.service';
import type {
  AiDecision,
  CreateAiAdmissionReportDTO,
  UpdateAiAdmissionReportDTO,
} from './aiAdmissionReport.model';
import { AiAdmissionReportEntity } from './aiAdmissionReport.entity';

import { CreateAiAdmissionReportDto, UpdateAiAdmissionReportDto } from './dto';

@Controller('ai-admission-reports')
@ApiTags('Ai Admission Report')
@Roles('SYSTEM_ADMIN')
export class AiAdmissionReportController {
  constructor(private readonly service: AiAdmissionReportService) {}

  private getCurrentUser(req: Request): { userId: number; campId: number; rol: string } {
    const currentUser = req.user as { userId?: number; campId?: number; rol?: string } | undefined;

    if (
      typeof currentUser?.userId !== 'number' ||
      currentUser.userId <= 0 ||
      typeof currentUser.campId !== 'number' ||
      currentUser.campId <= 0 ||
      typeof currentUser.rol !== 'string' ||
      !currentUser.rol
    ) {
      throw new BadRequestException('Authenticated user context is invalid');
    }

    return {
      userId: currentUser.userId,
      campId: currentUser.campId,
      rol: currentUser.rol,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create Ai Admission Report' })
  @ApiBody({ type: CreateAiAdmissionReportDto })
  @ApiCreatedResponseData(AiAdmissionReportEntity, { description: 'Ai Admission Report created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateAiAdmissionReportDTO, @Req() req: Request) {
    const currentUser = this.getCurrentUser(req);
    const requestCampId = await this.service.getAdmissionRequestCampId(body.requestId);
    if (requestCampId === null) {
      throw new NotFoundException('Admission request not found');
    }

    if (requestCampId !== currentUser.campId) {
      throw new NotFoundException('Admission request not found');
    }

    try {
      const report = await this.service.createReport(body);
      return {
        success: true,
        data: report,
        message: 'AI admission report created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating AI admission report',
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Ai Admission Report by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiOkResponseData(AiAdmissionReportEntity, { description: 'Ai Admission Report found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    const campId = await this.service.getReportCampId(parsedId);
    if (campId === null || campId !== currentUser.campId) {
      throw new NotFoundException('AI admission report not found');
    }

    const report = await this.service.getReportById(parsedId);
    if (!report) throw new NotFoundException('AI admission report not found');

    return { success: true, data: report };
  }

  @Get()
  @ApiOperation({ summary: 'List Ai Admission Report' })
  @ApiOkResponseList(AiAdmissionReportEntity, { description: 'Ai Admission Report list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAll(
    @Query('requestId') requestId?: string,
    @Query('aiDecision') aiDecision?: AiDecision,
    @Query('suggestedOccupationId') suggestedOccupationId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const filters: {
        requestId?: number;
        aiDecision?: AiDecision;
        suggestedOccupationId?: number;
        campId?: number;
        page?: number;
        limit?: number;
      } = {
        campId: currentUser.campId,
      };

      if (requestId) {
        const parsedRequestId = Number.parseInt(requestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');
        const requestCampId = await this.service.getAdmissionRequestCampId(parsedRequestId);
        if (requestCampId === null || requestCampId !== currentUser.campId) {
          throw new NotFoundException('AI admission report not found');
        }
        filters.requestId = parsedRequestId;
      }

      if (aiDecision) {
        filters.aiDecision = aiDecision;
      }

      if (suggestedOccupationId) {
        const parsedSuggestedOccupationId = Number.parseInt(suggestedOccupationId, 10);
        if (Number.isNaN(parsedSuggestedOccupationId)) {
          throw new BadRequestException('Invalid suggestedOccupationId');
        }
        filters.suggestedOccupationId = parsedSuggestedOccupationId;
      }

      if (page) {
        const parsedPage = Number.parseInt(page, 10);
        if (Number.isNaN(parsedPage) || parsedPage < 1) {
          throw new BadRequestException('Invalid page');
        }
        filters.page = parsedPage;
      }

      if (limit) {
        const parsedLimit = Number.parseInt(limit, 10);
        if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
          throw new BadRequestException('Invalid limit');
        }
        filters.limit = parsedLimit;
      }

      const result = await this.service.getAllReports(filters);
      const resolvedPage = filters.page ?? 1;
      const resolvedLimit = filters.limit ?? 10;

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
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting AI admission reports',
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Ai Admission Report' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiBody({ type: UpdateAiAdmissionReportDto })
  @ApiOkResponseData(AiAdmissionReportEntity, { description: 'Ai Admission Report updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAiAdmissionReportDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const campId = await this.service.getReportCampId(parsedId);
      if (campId === null || campId !== currentUser.campId) {
        throw new NotFoundException('AI admission report not found');
      }

      if (body.requestId !== undefined) {
        const requestCampId = await this.service.getAdmissionRequestCampId(body.requestId);
        if (requestCampId === null || requestCampId !== currentUser.campId) {
          throw new NotFoundException('Admission request not found');
        }
      }

      const report = await this.service.updateReport(parsedId, body);
      if (!report) throw new NotFoundException('AI admission report not found');

      return {
        success: true,
        data: report,
        message: 'AI admission report updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating AI admission report',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Ai Admission Report' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiOkResponseMessage({ description: 'Ai Admission Report deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const campId = await this.service.getReportCampId(parsedId);
      if (campId === null || campId !== currentUser.campId) {
        throw new NotFoundException('AI admission report not found');
      }

      const deleted = await this.service.deleteReport(parsedId);
      if (!deleted) throw new NotFoundException('AI admission report not found');

      return { success: true, message: 'AI admission report deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting AI admission report',
      );
    }
  }
}
