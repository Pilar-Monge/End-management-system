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


import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';

import { SessionService } from './session.service';
import type { CreateSessionDTO, SessionStatus, UpdateSessionDTO } from './session.model';
import { SessionEntity } from './session.entity';

import { CreateSessionDto, UpdateSessionDto } from './dto';
@Controller('sessions')
@ApiTags('Session')
export class SessionController {
  constructor(private readonly service: SessionService) {}
  @Post()
  @ApiOperation({ summary: 'Create Session' })
  @ApiBody({ type: CreateSessionDto })
  @ApiCreatedResponseData(SessionEntity, { description: 'Session created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateSessionDTO) {
    try {
      const session = await this.service.createSession(body);
      return {
        success: true,
        data: session,
        message: 'Session created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating session',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Session by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Session id' })
  @ApiOkResponseData(SessionEntity, { description: 'Session found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const session = await this.service.getSessionById(parsedId);
    if (!session) throw new NotFoundException('Session not found');

    return { success: true, data: session };
  }
  @Get()
  @ApiOperation({ summary: 'List Session' })
  @ApiOkResponseList(SessionEntity, { description: 'Session list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('userId') userId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('status') status?: SessionStatus,
    @Query('estado') estado?: SessionStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyCampamentoId = typeof req?.query?.campamentoId === 'string' ? (req.query.campamentoId as string) : undefined;
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;
      const legacyUsuarioId = typeof req?.query?.usuarioId === 'string' ? (req.query.usuarioId as string) : undefined;

      const filters: {
        userId?: number;
        campId?: number;
        status?: SessionStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedUserId = userId ?? legacyUsuarioId;
      if (resolvedUserId) {
        const parsedUserId = Number.parseInt(resolvedUserId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

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

      const result = await this.service.getAllSessions(filters);
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
        error instanceof Error ? error.message : 'Error getting sessions',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Session' })
  @ApiParam({ name: 'id', type: Number, description: 'Session id' })
  @ApiBody({ type: UpdateSessionDto })
  @ApiOkResponseData(SessionEntity, { description: 'Session updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async update(@Param('id') id: string, @Body() body: UpdateSessionDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const session = await this.service.updateSession(parsedId, body);
      if (!session) throw new NotFoundException('Session not found');

      return {
        success: true,
        data: session,
        message: 'Session updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating session',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Session' })
  @ApiParam({ name: 'id', type: Number, description: 'Session id' })
  @ApiOkResponseMessage({ description: 'Session deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteSession(parsedId);
      if (!deleted) throw new NotFoundException('Session not found');

      return { success: true, message: 'Session deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting session',
      );
    }
  }
}
