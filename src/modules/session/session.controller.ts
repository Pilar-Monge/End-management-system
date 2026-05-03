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
import { SessionService } from './session.service';
import type { CreateSessionDTO, SessionStatus, UpdateSessionDTO } from './session.model';
import { SessionEntity } from './session.entity';

import { CreateSessionDto, UpdateSessionDto } from './dto';

@Controller('sessions')
@ApiTags('Session')
@Roles('SYSTEM_ADMIN')
export class SessionController {
  constructor(private readonly service: SessionService) {}

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
  @ApiOperation({ summary: 'Create Session' })
  @ApiBody({ type: CreateSessionDto })
  @ApiCreatedResponseData(SessionEntity, { description: 'Session created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateSessionDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (body.campId !== currentUser.campId) {
        throw new BadRequestException('You cannot create sessions for another camp');
      }

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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    const session = await this.service.getSessionById(parsedId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.campId !== currentUser.campId) throw new NotFoundException('Session not found');

    return { success: true, data: session };
  }

  @Get()
  @ApiOperation({ summary: 'List Session' })
  @ApiOkResponseList(SessionEntity, { description: 'Session list' })
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
    @Query('status') status?: SessionStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const filters: {
        userId?: number;
        campId?: number;
        status?: SessionStatus;
        page?: number;
        limit?: number;
      } = {
        campId: currentUser.campId,
      };

      if (userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        if (parsedCampId !== currentUser.campId) {
          throw new BadRequestException('You cannot query sessions from another camp');
        }
        filters.campId = parsedCampId;
      }

      if (status) {
        filters.status = status;
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string, @Body() body: UpdateSessionDTO, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingSession = await this.service.getSessionById(parsedId);
      if (!existingSession) throw new NotFoundException('Session not found');
      if (existingSession.campId !== currentUser.campId) {
        throw new NotFoundException('Session not found');
      }

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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingSession = await this.service.getSessionById(parsedId);
      if (!existingSession) throw new NotFoundException('Session not found');
      if (existingSession.campId !== currentUser.campId) {
        throw new NotFoundException('Session not found');
      }

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
