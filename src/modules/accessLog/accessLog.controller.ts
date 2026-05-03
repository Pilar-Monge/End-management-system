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

import { AccessLogService } from './accessLog.service';
import type { AccessLogEventType, CreateAccessLogDTO, UpdateAccessLogDTO } from './accessLog.model';
import { AccessLogEntity } from './accessLog.entity';
import { CreateAccessLogDto, UpdateAccessLogDto } from './dto';
@Controller('access-logs')
@ApiTags('Access Log')
@Roles('SYSTEM_ADMIN')
export class AccessLogController {
  constructor(private readonly service: AccessLogService) {}

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
  @ApiOperation({ summary: 'Create Access Log' })
  @ApiBody({ type: CreateAccessLogDto })
  @ApiCreatedResponseData(AccessLogEntity, { description: 'Access Log created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateAccessLogDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (body.campId !== currentUser.campId) {
        throw new BadRequestException('You cannot create logs for another camp');
      }

      const log = await this.service.createLog(body);
      return {
        success: true,
        data: log,
        message: 'Access log created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating access log',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Access Log by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Access Log id' })
  @ApiOkResponseData(AccessLogEntity, { description: 'Access Log found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Access Log not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    const log = await this.service.getLogById(parsedId);
    if (!log) throw new NotFoundException('Access log not found');
    if (log.campId !== currentUser.campId) throw new NotFoundException('Access log not found');

    return { success: true, data: log };
  }
  @Get()
  @ApiOperation({ summary: 'List Access Log' })
  @ApiOkResponseList(AccessLogEntity, { description: 'Access Log list' })
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
    @Query('userId') userId?: string,
    @Query('campId') campId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('eventType') eventType?: AccessLogEventType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        userId?: number;
        campId?: number;
        sessionId?: number;
        eventType?: AccessLogEventType;
        page?: number;
        limit?: number;
      } = {};

      if (userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        filters.campId = parsedCampId;
      }

      if (sessionId) {
        const parsedSessionId = Number.parseInt(sessionId, 10);
        if (Number.isNaN(parsedSessionId)) throw new BadRequestException('Invalid sessionId');
        filters.sessionId = parsedSessionId;
      }

      if (eventType) {
        filters.eventType = eventType;
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

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      filters.campId = currentUser.campId;

      const result = await this.service.getAllLogs(filters);
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
        error instanceof Error ? error.message : 'Error getting access logs',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Access Log' })
  @ApiParam({ name: 'id', type: Number, description: 'Access Log id' })
  @ApiBody({ type: UpdateAccessLogDto })
  @ApiOkResponseData(AccessLogEntity, { description: 'Access Log updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Access Log not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string, @Body() body: UpdateAccessLogDTO, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingLog = await this.service.getLogById(parsedId);
      if (!existingLog) throw new NotFoundException('Access log not found');
      if (existingLog.campId !== currentUser.campId) {
        throw new NotFoundException('Access log not found');
      }

      const log = await this.service.updateLog(parsedId, body);
      if (!log) throw new NotFoundException('Access log not found');

      return {
        success: true,
        data: log,
        message: 'Access log updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating access log',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Access Log' })
  @ApiParam({ name: 'id', type: Number, description: 'Access Log id' })
  @ApiOkResponseMessage({ description: 'Access Log deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Access Log not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingLog = await this.service.getLogById(parsedId);
      if (!existingLog) throw new NotFoundException('Access log not found');
      if (existingLog.campId !== currentUser.campId) {
        throw new NotFoundException('Access log not found');
      }

      const deleted = await this.service.deleteLog(parsedId);
      if (!deleted) throw new NotFoundException('Access log not found');

      return { success: true, message: 'Access log deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting access log',
      );
    }
  }
}
