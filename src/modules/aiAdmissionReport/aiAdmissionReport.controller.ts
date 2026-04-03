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
  Req,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';
import { Roles } from '../../common/decorators';

import { AiAdmissionReportService } from './aiAdmissionReport.service';
import type {
  AiDecision,
  CreateAiAdmissionReportDTO,
  UpdateAiAdmissionReportDTO,
} from './aiAdmissionReport.model';

import { CreateAiAdmissionReportDto, UpdateAiAdmissionReportDto } from './dto';
@Controller('ai-admission-reports')
@ApiTags('Ai Admission Report')
@Roles('SYSTEM_ADMIN')
export class AiAdmissionReportController {
  constructor(private readonly service: AiAdmissionReportService) {}
  @Post()
  @ApiOperation({ summary: 'Create Ai Admission Report' })
  @ApiBody({ type: CreateAiAdmissionReportDto })
  @ApiCreatedResponse({ description: 'Ai Admission Report created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
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
  @ApiOperation({ summary: 'Get Ai Admission Report by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiOkResponse({ description: 'Ai Admission Report found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const report = await this.service.getReportById(parsedId);
    if (!report) throw new NotFoundException('AI admission report not found');

    return { success: true, data: report };
  }
  @Get()
  @ApiOperation({ summary: 'List Ai Admission Report' })
  @ApiOkResponse({ description: 'Ai Admission Report list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
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
  @ApiOperation({ summary: 'Update Ai Admission Report' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiBody({ type: UpdateAiAdmissionReportDto })
  @ApiOkResponse({ description: 'Ai Admission Report updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
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
  @ApiOperation({ summary: 'Delete Ai Admission Report' })
  @ApiParam({ name: 'id', type: Number, description: 'Ai Admission Report id' })
  @ApiOkResponse({ description: 'Ai Admission Report deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Ai Admission Report not found' })
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
