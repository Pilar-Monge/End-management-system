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
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';
import { ExpeditionResourceConsumedService } from './expeditionResourceConsumed.service';
import type {
  CreateExpeditionResourceConsumedDTO,
  UpdateExpeditionResourceConsumedDTO,
} from './expeditionResourceConsumed.model';
import { ExpeditionResourceConsumedEntity } from './expeditionResourceConsumed.entity';

import { CreateExpeditionResourceConsumedDto, UpdateExpeditionResourceConsumedDto } from './dto';
@Controller('expedition-resources-consumed')
@ApiTags('Expedition Resource Consumed')
@Roles('TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN')
export class ExpeditionResourceConsumedController {
  constructor(private readonly service: ExpeditionResourceConsumedService) {}

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

  private isSystemAdmin(rol: string): boolean {
    return rol === 'SYSTEM_ADMIN';
  }

  @Post()
  @ApiOperation({ summary: 'Create Expedition Resource Consumed' })
  @ApiBody({ type: CreateExpeditionResourceConsumedDto })
  @ApiCreatedResponseData(ExpeditionResourceConsumedEntity, {
    description: 'Expedition Resource Consumed created',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateExpeditionResourceConsumedDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol) && body.recordedBy !== currentUser.userId) {
        throw new BadRequestException('recordedBy must match the authenticated user');
      }

      const record = await this.service.createRecord(body);
      return {
        success: true,
        data: record,
        message: 'Expedition consumed resource recorded successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error creating expedition resource consumed record',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Expedition Resource Consumed by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Consumed id' })
  @ApiOkResponseData(ExpeditionResourceConsumedEntity, {
    description: 'Expedition Resource Consumed found',
  })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Consumed not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const record = await this.service.getRecordById(parsedId);
    if (!record) throw new NotFoundException('Record not found');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol) && record.recordedBy !== currentUser.userId) {
      throw new BadRequestException('You do not have permission to view this record');
    }

    return { success: true, data: record };
  }
  @Get()
  @ApiOperation({ summary: 'List Expedition Resource Consumed' })
  @ApiOkResponseList(ExpeditionResourceConsumedEntity, {
    description: 'Expedition Resource Consumed list',
  })
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
    @Query('expeditionId') expeditionId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('recordedBy') recordedBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        expeditionId?: number;
        resourceTypeId?: number;
        recordedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin) {
        filters.recordedBy = currentUser.userId;
      }

      if (expeditionId) {
        const parsedExpeditionId = Number.parseInt(expeditionId, 10);
        if (Number.isNaN(parsedExpeditionId)) {
          throw new BadRequestException('Invalid expeditionId');
        }
        filters.expeditionId = parsedExpeditionId;
      }

      if (resourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resourceTypeId');
        }
        filters.resourceTypeId = parsedResourceTypeId;
      }

      if (recordedBy) {
        const parsedRecordedBy = Number.parseInt(recordedBy, 10);
        if (Number.isNaN(parsedRecordedBy)) {
          throw new BadRequestException('Invalid recordedBy');
        }

        if (!isAdmin && parsedRecordedBy !== currentUser.userId) {
          throw new BadRequestException('recordedBy filter must match the authenticated user');
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
          : 'Error getting expedition resource consumed records',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Expedition Resource Consumed' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Consumed id' })
  @ApiBody({ type: UpdateExpeditionResourceConsumedDto })
  @ApiOkResponseData(ExpeditionResourceConsumedEntity, {
    description: 'Expedition Resource Consumed updated',
  })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Consumed not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExpeditionResourceConsumedDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingRecord = await this.service.getRecordById(parsedId);
      if (!existingRecord) {
        throw new NotFoundException('Record not found');
      }

      if (
        !this.isSystemAdmin(currentUser.rol) &&
        existingRecord.recordedBy !== currentUser.userId
      ) {
        throw new BadRequestException('You can only update records created by your user');
      }

      if (
        !this.isSystemAdmin(currentUser.rol) &&
        body.recordedBy !== undefined &&
        body.recordedBy !== currentUser.userId
      ) {
        throw new BadRequestException('recordedBy must match the authenticated user');
      }

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
          : 'Error updating expedition resource consumed record',
      );
    }
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Expedition Resource Consumed' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Resource Consumed id' })
  @ApiOkResponseMessage({ description: 'Expedition Resource Consumed deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Resource Consumed not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete() {
    throw new ForbiddenException('Resource records cannot be deleted for audit reasons.');
  }
}
