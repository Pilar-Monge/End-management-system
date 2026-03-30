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


import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';


import { ExpeditionService } from './expedition.service';
import type {
  CreateExpeditionDTO,
  ExpeditionStatus,
  UpdateExpeditionDTO,
} from './expedition.model';

import { CreateExpeditionDto, UpdateExpeditionDto } from './dto';
@Controller('expeditions')
@ApiTags('Expedition')
export class ExpeditionController {
  constructor(private readonly service: ExpeditionService) {}
  @Post()
  @ApiOperation({ summary: 'Create Expedition' })
  @ApiBody({ type: CreateExpeditionDto })
  @ApiCreatedResponse({ description: 'Expedition created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateExpeditionDTO) {
    try {
      const expedition = await this.service.createExpedition(body);
      return {
        success: true,
        data: expedition,
        message: 'Expedition created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating expedition',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Expedition by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponse({ description: 'Expedition found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const expedition = await this.service.getExpeditionById(parsedId);
    if (!expedition) throw new NotFoundException('Expedition not found');

    return { success: true, data: expedition };
  }
  @Get()
  @ApiOperation({ summary: 'List Expedition' })
  @ApiOkResponse({ description: 'Expedition list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('status') status?: ExpeditionStatus,
    @Query('estado') estado?: ExpeditionStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyCampamentoId = typeof req?.query?.campamentoId === 'string' ? (req.query.campamentoId as string) : undefined;
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        campId?: number;
        status?: ExpeditionStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? legacyCampamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        filters.campId = parsedCampId;
      }

      const resolvedStatus = status ?? (legacyEstado as any);
      if (resolvedStatus) {
        filters.status = resolvedStatus;
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

      const result = await this.service.getAllExpeditions(filters);
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
        error instanceof Error ? error.message : 'Error getting expeditions',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Expedition' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiBody({ type: UpdateExpeditionDto })
  @ApiOkResponse({ description: 'Expedition updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  async update(@Param('id') id: string, @Body() body: UpdateExpeditionDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const expedition = await this.service.updateExpedition(parsedId, body);
      if (!expedition) throw new NotFoundException('Expedition not found');

      return {
        success: true,
        data: expedition,
        message: 'Expedition updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating expedition',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Expedition' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponse({ description: 'Expedition deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteExpedition(parsedId);
      if (!deleted) throw new NotFoundException('Expedition not found');

      return { success: true, message: 'Expedition deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting expedition',
      );
    }
  }
}
