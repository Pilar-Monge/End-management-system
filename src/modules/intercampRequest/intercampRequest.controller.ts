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


import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';


import { IntercampRequestService } from './intercampRequest.service';
import type {
  CreateIntercampRequestDTO,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

import { CreateIntercampRequestDto, UpdateIntercampRequestDto } from './dto';
@Controller('intercamp-requests')
@ApiTags('Intercamp Request')
export class IntercampRequestController {
  constructor(private readonly service: IntercampRequestService) {}
  @Post()
  @ApiOperation({ summary: 'Create Intercamp Request' })
  @ApiBody({ type: CreateIntercampRequestDto })
  @ApiCreatedResponse({ description: 'Intercamp Request created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateIntercampRequestDTO) {
    try {
      const request = await this.service.createRequest(body);
      return {
        success: true,
        data: request,
        message: 'Intercamp request created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating intercamp request',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Intercamp Request by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponse({ description: 'Intercamp Request found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const request = await this.service.getRequestById(parsedId);
    if (!request) throw new NotFoundException('Intercamp request not found');

    return { success: true, data: request };
  }
  @Get()
  @ApiOperation({ summary: 'List Intercamp Request' })
  @ApiOkResponse({ description: 'Intercamp Request list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('originCampId') originCampId?: string,
    @Query('campamentoOrigenId') campamentoOrigenId?: string,
    @Query('destinationCampId') destinationCampId?: string,
    @Query('campamentoDestinoId') campamentoDestinoId?: string,
    @Query('status') status?: IntercampRequestStatus,
    @Query('estado') estado?: IntercampRequestStatus,
    @Query('createdBy') createdBy?: string,
    @Query('creadoPor') creadoPor?: string,
    @Query('respondedBy') respondedBy?: string,
    @Query('respondidoPor') respondidoPor?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        originCampId?: number;
        destinationCampId?: number;
        status?: IntercampRequestStatus;
        createdBy?: number;
        respondedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedOriginCampId = originCampId ?? campamentoOrigenId;
      if (resolvedOriginCampId) {
        const parsedOriginCampId = Number.parseInt(resolvedOriginCampId, 10);
        if (Number.isNaN(parsedOriginCampId)) {
          throw new BadRequestException('Invalid originCampId');
        }
        filters.originCampId = parsedOriginCampId;
      }

      const resolvedDestinationCampId = destinationCampId ?? campamentoDestinoId;
      if (resolvedDestinationCampId) {
        const parsedDestinationCampId = Number.parseInt(resolvedDestinationCampId, 10);
        if (Number.isNaN(parsedDestinationCampId)) {
          throw new BadRequestException('Invalid destinationCampId');
        }
        filters.destinationCampId = parsedDestinationCampId;
      }

      const resolvedStatus = status ?? (legacyEstado as any);
      if (resolvedStatus) {
        filters.status = resolvedStatus;
      }

      const resolvedCreatedBy = createdBy ?? creadoPor;
      if (resolvedCreatedBy) {
        const parsedCreatedBy = Number.parseInt(resolvedCreatedBy, 10);
        if (Number.isNaN(parsedCreatedBy)) {
          throw new BadRequestException('Invalid createdBy');
        }
        filters.createdBy = parsedCreatedBy;
      }

      const resolvedRespondedBy = respondedBy ?? respondidoPor;
      if (resolvedRespondedBy) {
        const parsedRespondedBy = Number.parseInt(resolvedRespondedBy, 10);
        if (Number.isNaN(parsedRespondedBy)) {
          throw new BadRequestException('Invalid respondedBy');
        }
        filters.respondedBy = parsedRespondedBy;
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

      const result = await this.service.getAllRequests(filters);
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
        error instanceof Error
          ? error.message
          : 'Error getting intercamp requests',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Intercamp Request' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiBody({ type: UpdateIntercampRequestDto })
  @ApiOkResponse({ description: 'Intercamp Request updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async update(@Param('id') id: string, @Body() body: UpdateIntercampRequestDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const request = await this.service.updateRequest(parsedId, body);
      if (!request) throw new NotFoundException('Intercamp request not found');

      return {
        success: true,
        data: request,
        message: 'Intercamp request updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating intercamp request',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Intercamp Request' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponse({ description: 'Intercamp Request deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteRequest(parsedId);
      if (!deleted) throw new NotFoundException('Intercamp request not found');

      return { success: true, message: 'Intercamp request deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error deleting intercamp request',
      );
    }
  }
}
