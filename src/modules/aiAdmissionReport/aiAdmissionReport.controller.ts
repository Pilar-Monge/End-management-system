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

import { AiAdmissionReportService } from './aiAdmissionReport.service';
import type {
  AiDecision,
  CreateAiAdmissionReportDTO,
  UpdateAiAdmissionReportDTO,
} from './aiAdmissionReport.model';

@Controller('ai-admission-reports')
export class AiAdmissionReportController {
  constructor(private readonly service: AiAdmissionReportService) {}

  @Post()
  async create(@Body() body: CreateAiAdmissionReportDTO) {
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
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const report = await this.service.getReportById(parsedId);
    if (!report) throw new NotFoundException('AI admission report not found');

    return { success: true, data: report };
  }

  @Get()
  async getAll(
    @Query('requestId') requestId?: string,
    @Query('solicitudId') solicitudId?: string,
    @Query('aiDecision') aiDecision?: AiDecision,
    @Query('decisionIA') decisionIA?: AiDecision,
    @Query('suggestedOccupationId') suggestedOccupationId?: string,
    @Query('ocupacionSugeridaId') ocupacionSugeridaId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        requestId?: number;
        aiDecision?: AiDecision;
        suggestedOccupationId?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedRequestId = requestId ?? solicitudId;
      if (resolvedRequestId) {
        const parsedRequestId = Number.parseInt(resolvedRequestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');
        filters.requestId = parsedRequestId;
      }

      const resolvedDecision = aiDecision ?? decisionIA;
      if (resolvedDecision) {
        filters.aiDecision = resolvedDecision;
      }

      const resolvedSuggestedOccupationId = suggestedOccupationId ?? ocupacionSugeridaId;
      if (resolvedSuggestedOccupationId) {
        const parsedSuggestedOccupationId = Number.parseInt(resolvedSuggestedOccupationId, 10);
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
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting AI admission reports',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateAiAdmissionReportDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const report = await this.service.updateReport(parsedId, body);
      if (!report) throw new NotFoundException('AI admission report not found');

      return {
        success: true,
        data: report,
        message: 'AI admission report updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating AI admission report',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteReport(parsedId);
      if (!deleted) throw new NotFoundException('AI admission report not found');

      return { success: true, message: 'AI admission report deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting AI admission report',
      );
    }
  }
}
