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


import { ExpeditionResourceObtainedService } from './expeditionResourceObtained.service';
import type {
  CreateExpeditionResourceObtainedDTO,
  UpdateExpeditionResourceObtainedDTO,
} from './expeditionResourceObtained.model';

import { CreateExpeditionResourceObtainedDto, UpdateExpeditionResourceObtainedDto } from './dto';
@Controller('expedition-resources-obtained')
@ApiTags('Expedition Resource Obtained')
export class ExpeditionResourceObtainedController {
  constructor(private readonly service: ExpeditionResourceObtainedService) {}
  @Post()
  @ApiOperation({ summary: 'Create Expedition Resource Obtained' })
  @ApiBody({ type: CreateExpeditionResourceObtainedDto })
  @ApiCreatedResponse({ description: 'Expedition Resource Obtained created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateExpeditionResourceObtainedDTO) {
    try {
      const record = await this.service.createRecord(body);
      return {
        success: true,
        data: record,
        message: 'Expedition obtained resource recorded successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error creating expedition resource obtained record',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Expedition Resource Obtained by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Obtained id' })
  @ApiOkResponse({ description: 'Expedition Resource Obtained found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Obtained not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const record = await this.service.getRecordById(parsedId);
    if (!record) throw new NotFoundException('Record not found');

    return { success: true, data: record };
  }
  @Get()
  @ApiOperation({ summary: 'List Expedition Resource Obtained' })
  @ApiOkResponse({ description: 'Expedition Resource Obtained list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('expeditionId') expeditionId?: string,
    @Query('expedicionId') expedicionId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('tipoRecursoId') tipoRecursoId?: string,
    @Query('recordedBy') recordedBy?: string,
    @Query('registradoPor') registradoPor?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        expeditionId?: number;
        resourceTypeId?: number;
        recordedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedExpeditionId = expeditionId ?? expedicionId;
      if (resolvedExpeditionId) {
        const parsedExpeditionId = Number.parseInt(resolvedExpeditionId, 10);
        if (Number.isNaN(parsedExpeditionId)) {
          throw new BadRequestException('Invalid expeditionId');
        }
        filters.expeditionId = parsedExpeditionId;
      }

      const resolvedResourceTypeId = resourceTypeId ?? tipoRecursoId;
      if (resolvedResourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resolvedResourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resourceTypeId');
        }
        filters.resourceTypeId = parsedResourceTypeId;
      }

      const resolvedRecordedBy = recordedBy ?? registradoPor;
      if (resolvedRecordedBy) {
        const parsedRecordedBy = Number.parseInt(resolvedRecordedBy, 10);
        if (Number.isNaN(parsedRecordedBy)) {
          throw new BadRequestException('Invalid recordedBy');
        }
        filters.recordedBy = parsedRecordedBy;
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

      const result = await this.service.getAllRecords(filters);
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
          : 'Error getting expedition resource obtained records',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Expedition Resource Obtained' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Obtained id' })
  @ApiBody({ type: UpdateExpeditionResourceObtainedDto })
  @ApiOkResponse({ description: 'Expedition Resource Obtained updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Obtained not found' })
  async update(@Param('id') id: string, @Body() body: UpdateExpeditionResourceObtainedDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const record = await this.service.updateRecord(parsedId, body);
      if (!record) throw new NotFoundException('Record not found');

      return {
        success: true,
        data: record,
        message: 'Record updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating expedition resource obtained record',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Expedition Resource Obtained' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Obtained id' })
  @ApiOkResponse({ description: 'Expedition Resource Obtained deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Obtained not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteRecord(parsedId);
      if (!deleted) throw new NotFoundException('Record not found');

      return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error deleting expedition resource obtained record',
      );
    }
  }
}
