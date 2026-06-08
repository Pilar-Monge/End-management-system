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

import { ExpeditionService } from './expedition.service';
import type {
  CreateExpeditionDTO,
  ExpeditionStatus,
  UpdateExpeditionDTO,
} from './expedition.model';
import { ExpeditionEntity } from './expedition.entity';

import { CreateExpeditionDto, UpdateExpeditionDto } from './dto';
@Controller('expeditions')
@ApiTags('Expedition')
export class ExpeditionController {
  constructor(private readonly service: ExpeditionService) {}

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
  @Roles('TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Create Expedition' })
  @ApiBody({ type: CreateExpeditionDto })
  @ApiCreatedResponseData(ExpeditionEntity, { description: 'Expedition created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateExpeditionDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol) && body.campId !== currentUser.campId) {
        throw new BadRequestException('You can only create expeditions in your own camp');
      }

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

  @Get('active')
  @Roles('TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List active expeditions' })
  @ApiOkResponseList(ExpeditionEntity, { description: 'Active expeditions' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getActive(@Query('campId') campId?: string, @Req() req?: Request) {
    let parsedCampId: number | undefined;

    if (!req) {
      throw new BadRequestException('Request context is required');
    }

    const currentUser = this.getCurrentUser(req);
    const isAdmin = this.isSystemAdmin(currentUser.rol);

    if (campId !== undefined) {
      parsedCampId = Number.parseInt(campId, 10);
      if (Number.isNaN(parsedCampId)) {
        throw new BadRequestException('Invalid campId');
      }

      if (!isAdmin && parsedCampId !== currentUser.campId) {
        throw new BadRequestException('You cannot query active expeditions from another camp');
      }
    }

    if (!isAdmin && parsedCampId === undefined) {
      parsedCampId = currentUser.campId;
    }

    const data = await this.service.getActiveExplorations(parsedCampId);
    return { success: true, data };
  }
  @Get(':id')
  @Roles('TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get Expedition by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponseData(ExpeditionEntity, { description: 'Expedition found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const expedition = await this.service.getExpeditionById(parsedId);
    if (!expedition) throw new NotFoundException('Expedition not found');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol) && expedition.campId !== currentUser.campId) {
      throw new BadRequestException('You do not have permission to view this expedition');
    }

    return { success: true, data: expedition };
  }
  @Get()
  @Roles('TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List Expedition' })
  @ApiOkResponseList(ExpeditionEntity, { description: 'Expedition list' })
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
    @Query('campId') campId?: string,
    @Query('status') status?: ExpeditionStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        campId?: number;
        status?: ExpeditionStatus;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin) {
        filters.campId = currentUser.campId;
      }

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');

        if (!isAdmin && parsedCampId !== currentUser.campId) {
          throw new BadRequestException('You cannot query expeditions from another camp');
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
  @Roles('TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Update Expedition' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiBody({ type: UpdateExpeditionDto })
  @ApiOkResponseData(ExpeditionEntity, { description: 'Expedition updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string, @Body() body: UpdateExpeditionDTO, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingExpedition = await this.service.getExpeditionById(parsedId);
      if (!existingExpedition) {
        throw new NotFoundException('Expedition not found');
      }

      if (
        !this.isSystemAdmin(currentUser.rol) &&
        (existingExpedition.campId !== currentUser.campId ||
          (body.campId !== undefined && body.campId !== currentUser.campId))
      ) {
        throw new BadRequestException('You can only update expeditions from your own camp');
      }

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

  @Post(':id/complete')
  @Roles('TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Complete expedition' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponseData(ExpeditionEntity, { description: 'Expedition completed' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async complete(@Param('id') id: string, @Req() req: Request & { user?: { userId?: number } }) {
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    try {
      const currentUser = this.getCurrentUser(req);
      const expedition = await this.service.getExpeditionById(parsedId);
      if (!expedition) {
        throw new NotFoundException('Expedition not found');
      }

      if (!this.isSystemAdmin(currentUser.rol) && expedition.campId !== currentUser.campId) {
        throw new BadRequestException('You can only complete expeditions from your own camp');
      }

      const completed = await this.service.completeExploration(parsedId, currentUser.userId);
      if (!completed) {
        throw new NotFoundException('Expedition not found');
      }

      return {
        success: true,
        data: completed,
        message: 'Expedition completed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Error &&
        error.message === 'Solo los participantes activos pueden completar esta expedicion'
      ) {
        throw new ForbiddenException(error.message);
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error completing exploration',
      );
    }
  }

  @Post(':id/force-update-state')
  @Roles('TRAVEL_MANAGER')
  @ApiOperation({
    summary: 'Force update expedition state based on current time',
    description:
      'Manually trigger state update for an expedition (auto-transition from PLANNED→IN_PROGRESS→DELAYED→LOST)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponseData(ExpeditionEntity, { description: 'Expedition state updated' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async forceUpdateState(@Param('id') id: string, @Req() req: Request) {
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    try {
      const currentUser = this.getCurrentUser(req);
      const expedition = await this.service.getExpeditionById(parsedId);
      if (!expedition) {
        throw new NotFoundException('Expedition not found');
      }

      if (!this.isSystemAdmin(currentUser.rol) && expedition.campId !== currentUser.campId) {
        throw new BadRequestException('You can only update expedition states from your own camp');
      }

      const updated = await this.service.forceUpdateExpeditionState(parsedId);
      if (!updated) {
        throw new NotFoundException('Expedition not found');
      }

      return {
        success: true,
        data: updated,
        message: 'Expedition state updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating expedition state',
      );
    }
  }

  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Expedition' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition id' })
  @ApiOkResponseMessage({ description: 'Expedition deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Expedition records cannot be deleted for audit reasons.');
  }
}
