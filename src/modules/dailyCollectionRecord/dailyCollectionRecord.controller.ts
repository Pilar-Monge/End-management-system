import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { DailyCollectionRecordService } from './dailyCollectionRecord.service';
import type {
  CreateDailyCollectionRecordDTO,
  UpdateDailyCollectionRecordDTO,
} from './dailyCollectionRecord.model';
import { DailyCollectionRecordEntity } from './dailyCollectionRecord.entity';

import { CreateDailyCollectionRecordDto, UpdateDailyCollectionRecordDto } from './dto';
@Controller('daily-collection-records')
@ApiTags('Daily Collection Record')
export class DailyCollectionRecordController {
  constructor(private readonly service: DailyCollectionRecordService) {}
  @Post()
  @Roles('WORKER', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Create Daily Collection Record' })
  @ApiBody({ type: CreateDailyCollectionRecordDto })
  @ApiCreatedResponseData(DailyCollectionRecordEntity, {
    description: 'Daily Collection Record created',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateDailyCollectionRecordDTO) {
    try {
      const record = await this.service.createRecord(body);
      return {
        success: true,
        data: record,
        message: 'Daily collection record created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating daily collection record',
      );
    }
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'WORKER')
  @ApiOperation({ summary: 'Get Daily Collection Record by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Daily Collection Record id' })
  @ApiOkResponseData(DailyCollectionRecordEntity, { description: 'Daily Collection Record found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Daily Collection Record not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const record = await this.service.getRecordById(parsedId);
    if (!record) throw new NotFoundException('Daily collection record not found');

    return { success: true, data: record };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'WORKER')
  @ApiOperation({ summary: 'List Daily Collection Record' })
  @ApiOkResponseList(DailyCollectionRecordEntity, { description: 'Daily Collection Record list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('campId') campId?: string,
    @Query('personId') personId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        personId?: number;
        resourceTypeId?: number;
        date?: string;
        page?: number;
        limit?: number;
      } = {};

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid camp ID');
        filters.campId = parsedCampId;
      }

      if (personId) {
        const parsedPersonId = Number.parseInt(personId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid person ID');
        filters.personId = parsedPersonId;
      }

      if (resourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resource type ID');
        }
        filters.resourceTypeId = parsedResourceTypeId;
      }

      if (date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          throw new BadRequestException('Invalid date (expected YYYY-MM-DD)');
        }
        filters.date = date;
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
        error instanceof Error ? error.message : 'Error getting daily collection records',
      );
    }
  }
  @Put(':id')
  @Roles('WORKER', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Update Daily Collection Record' })
  @ApiParam({ name: 'id', type: Number, description: 'Daily Collection Record id' })
  @ApiBody({ type: UpdateDailyCollectionRecordDto })
  @ApiOkResponseData(DailyCollectionRecordEntity, {
    description: 'Daily Collection Record updated',
  })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Daily Collection Record not found' })
  async update(@Param('id') id: string, @Body() body: UpdateDailyCollectionRecordDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const record = await this.service.updateRecord(parsedId, body);
      if (!record) throw new NotFoundException('Daily collection record not found');

      return {
        success: true,
        data: record,
        message: 'Daily collection record updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating daily collection record',
      );
    }
  }
  @Delete(':id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Delete Daily Collection Record' })
  @ApiParam({ name: 'id', type: Number, description: 'Daily Collection Record id' })
  @ApiOkResponseMessage({ description: 'Daily Collection Record deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Daily Collection Record not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Daily collection records cannot be deleted for audit reasons');
  }
}
