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
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { IntercampRequestService } from './intercampRequest.service';
import type {
  CreateIntercampRequestDTO,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';
import { IntercampRequestEntity } from './intercampRequest.entity';

import { CreateIntercampRequestDto, UpdateIntercampRequestDto } from './dto';
@Controller('intercamp-requests')
@ApiTags('Intercamp Request')
export class IntercampRequestController {
  constructor(private readonly service: IntercampRequestService) {}

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
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Create Intercamp Request' })
  @ApiBody({ type: CreateIntercampRequestDto })
  @ApiCreatedResponseData(IntercampRequestEntity, { description: 'Intercamp Request created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateIntercampRequestDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        if (body.originCampId !== currentUser.campId) {
          throw new BadRequestException('originCampId must match your authenticated camp');
        }

        if (body.createdBy !== currentUser.userId) {
          throw new BadRequestException('createdBy must match the authenticated user');
        }
      }

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
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Get Intercamp Request by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponseData(IntercampRequestEntity, { description: 'Intercamp Request found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const request = await this.service.getRequestById(parsedId);
    if (!request) throw new NotFoundException('Intercamp request not found');

    const currentUser = this.getCurrentUser(req);
    if (
      !this.isSystemAdmin(currentUser.rol) &&
      request.originCampId !== currentUser.campId &&
      request.destinationCampId !== currentUser.campId
    ) {
      throw new BadRequestException('You do not have permission to view this intercamp request');
    }

    return { success: true, data: request };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'List Intercamp Request' })
  @ApiOkResponseList(IntercampRequestEntity, { description: 'Intercamp Request list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('originCampId') originCampId?: string,
    @Query('destinationCampId') destinationCampId?: string,
    @Query('status') status?: IntercampRequestStatus,
    @Query('createdBy') createdBy?: string,
    @Query('respondedBy') respondedBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        originCampId?: number;
        destinationCampId?: number;
        involvedCampId?: number;
        status?: IntercampRequestStatus;
        createdBy?: number;
        respondedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (originCampId) {
        const parsedOriginCampId = Number.parseInt(originCampId, 10);
        if (Number.isNaN(parsedOriginCampId)) {
          throw new BadRequestException('Invalid originCampId');
        }
        filters.originCampId = parsedOriginCampId;
      }

      if (destinationCampId) {
        const parsedDestinationCampId = Number.parseInt(destinationCampId, 10);
        if (Number.isNaN(parsedDestinationCampId)) {
          throw new BadRequestException('Invalid destinationCampId');
        }
        filters.destinationCampId = parsedDestinationCampId;
      }

      if (status) {
        filters.status = status;
      }

      if (createdBy) {
        const parsedCreatedBy = Number.parseInt(createdBy, 10);
        if (Number.isNaN(parsedCreatedBy)) {
          throw new BadRequestException('Invalid createdBy');
        }
        filters.createdBy = parsedCreatedBy;
      }

      if (!isAdmin) {
        filters.involvedCampId = currentUser.campId;

        if (filters.createdBy !== undefined && filters.createdBy !== currentUser.userId) {
          throw new BadRequestException('createdBy filter must match the authenticated user');
        }
      }

      if (respondedBy) {
        const parsedRespondedBy = Number.parseInt(respondedBy, 10);
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
        error instanceof Error ? error.message : 'Error getting intercamp requests',
      );
    }
  }
  @Put(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Update Intercamp Request' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiBody({ type: UpdateIntercampRequestDto })
  @ApiOkResponseData(IntercampRequestEntity, { description: 'Intercamp Request updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateIntercampRequestDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const existingRequest = await this.service.getRequestById(parsedId);
      if (!existingRequest) {
        throw new NotFoundException('Intercamp request not found');
      }

      if (
        !this.isSystemAdmin(currentUser.rol) &&
        existingRequest.originCampId !== currentUser.campId &&
        existingRequest.destinationCampId !== currentUser.campId
      ) {
        throw new BadRequestException('You can only update requests involving your camp');
      }

      if (!this.isSystemAdmin(currentUser.rol)) {
        if (body.originCampId !== undefined && body.originCampId !== currentUser.campId) {
          throw new BadRequestException('originCampId must match your authenticated camp');
        }

        if (body.createdBy !== undefined && body.createdBy !== currentUser.userId) {
          throw new BadRequestException('createdBy must match the authenticated user');
        }
      }

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
        error instanceof Error ? error.message : 'Error updating intercamp request',
      );
    }
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Intercamp Request' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponseMessage({ description: 'Intercamp Request deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Transfer records cannot be deleted for audit reasons.');
  }
}
