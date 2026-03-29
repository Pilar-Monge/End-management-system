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
} from '@nestjs/common';

import { AccessLogService } from './accessLog.service';
import type {
  AccessLogEventType,
  CreateAccessLogDTO,
  UpdateAccessLogDTO,
} from './accessLog.model';

@Controller('access-logs')
export class AccessLogController {
  constructor(private readonly service: AccessLogService) {}

  @Post()
  async create(@Body() body: CreateAccessLogDTO) {
    try {
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
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const log = await this.service.getLogById(parsedId);
    if (!log) throw new NotFoundException('Access log not found');

    return { success: true, data: log };
  }

  @Get()
  async getAll(
    @Query('userId') userId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('sesionId') sesionId?: string,
    @Query('eventType') eventType?: AccessLogEventType,
    @Query('tipoEvento') tipoEvento?: AccessLogEventType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
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

      const resolvedUserId = userId ?? usuarioId;
      if (resolvedUserId) {
        const parsedUserId = Number.parseInt(resolvedUserId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      const resolvedCampId = campId ?? campamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        filters.campId = parsedCampId;
      }

      const resolvedSessionId = sessionId ?? sesionId;
      if (resolvedSessionId) {
        const parsedSessionId = Number.parseInt(resolvedSessionId, 10);
        if (Number.isNaN(parsedSessionId)) throw new BadRequestException('Invalid sessionId');
        filters.sessionId = parsedSessionId;
      }

      const resolvedEventType = eventType ?? tipoEvento;
      if (resolvedEventType) {
        filters.eventType = resolvedEventType;
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
  async update(@Param('id') id: string, @Body() body: UpdateAccessLogDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
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
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
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
