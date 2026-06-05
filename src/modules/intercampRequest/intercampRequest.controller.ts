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

  @Post()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Create Intercamp Request' })
  @ApiBody({
    type: CreateIntercampRequestDto,
    examples: {
      camp1ToCamp2FoodRequest: {
        summary: 'Camp 1 requests food from Camp 2',
        value: {
          originCampId: 1,
          destinationCampId: 2,
          status: 'PENDING',
          description: 'Request 100 units of canned food from camp 1 to camp 2',
          plannedDepartureDate: '2026-06-01T09:00:00Z',
          plannedArrivalDate: '2026-06-01T11:00:00Z',
          createdDate: '2026-04-05T12:00:00Z',
          responseDate: null,
          createdBy: 3,
          respondedBy: null,
        },
      },
    },
  })
  @ApiCreatedResponseData(IntercampRequestEntity, { description: 'Intercamp Request created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateIntercampRequestDTO, @Req() req: Request) {
    try {
      const missing: string[] = [];
      if (body.originCampId === undefined || body.originCampId === null)
        missing.push('originCampId');
      if (body.destinationCampId === undefined || body.destinationCampId === null)
        missing.push('destinationCampId');
      if (!body.plannedDepartureDate) missing.push('plannedDepartureDate');
      if (!body.plannedArrivalDate) missing.push('plannedArrivalDate');
      if (body.createdBy === undefined || body.createdBy === null) missing.push('createdBy');

      if (missing.length > 0) {
        throw new BadRequestException(`Missing required field(s): ${missing.join(', ')}`);
      }

      try {
        const dep = new Date(String(body.plannedDepartureDate));
        const arr = new Date(String(body.plannedArrivalDate));
        if (!(arr.getTime() > dep.getTime() + 60_000)) {
          throw new BadRequestException(
            'plannedArrivalDate must be at least 1 minute after plannedDepartureDate',
          );
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException(
          'Invalid date format for plannedDepartureDate or plannedArrivalDate',
        );
      }

      const currentUser = this.getCurrentUser(req);
      if (body.originCampId !== currentUser.campId) {
        throw new BadRequestException('originCampId must match your authenticated camp');
      }

      if (body.createdBy !== currentUser.userId) {
        throw new BadRequestException('createdBy must match the authenticated user');
      }

      const request = await this.service.createRequest(body);
      if (!request) {
        throw new BadRequestException(
          'Could not create intercamp request — please verify required fields and try again',
        );
      }

      return {
        success: true,
        data: request,
        message: 'Intercamp request draft created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const msg = typeof error === 'string' ? error : error instanceof Error ? error.message : null;
      if (msg) {
        if (msg.includes('null value in column')) {
          const col = msg.split('column "')[1]?.split('"')[0];
          if (col) throw new BadRequestException(`Missing required column: ${col}`);
        }

        if (msg.includes('violates foreign key constraint')) {
          throw new BadRequestException(
            'Foreign key constraint violation: check referenced camp or user ids',
          );
        }
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating intercamp request',
      );
    }
  }
  @Post(':id/submit')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Submit Intercamp Request draft' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponseData(IntercampRequestEntity, { description: 'Intercamp Request submitted' })
  @ApiBadRequestResponse({ description: 'Invalid id or request cannot be submitted' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async submit(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    const request = await this.service.submitRequest(parsedId, currentUser);
    if (!request) throw new NotFoundException('Intercamp request not found');

    return {
      success: true,
      data: request,
      message: 'Intercamp request submitted successfully',
    };
  }
  @Get(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get Intercamp Request by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Intercamp Request id' })
  @ApiOkResponseData(IntercampRequestEntity, { description: 'Intercamp Request found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Intercamp Request not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const request = await this.service.getRequestById(parsedId);
    if (!request) throw new NotFoundException('Intercamp request not found');

    const currentUser = this.getCurrentUser(req);
    if (
      request.originCampId !== currentUser.campId &&
      request.destinationCampId !== currentUser.campId
    ) {
      throw new BadRequestException('You do not have permission to view this intercamp request');
    }

    return { success: true, data: request };
  }
  @Get()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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

      filters.involvedCampId = currentUser.campId;

      if (
        currentUser.rol !== 'SYSTEM_ADMIN' &&
        filters.createdBy !== undefined &&
        filters.createdBy !== currentUser.userId
      ) {
        throw new BadRequestException('createdBy filter must match the authenticated user');
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
        existingRequest.originCampId !== currentUser.campId &&
        existingRequest.destinationCampId !== currentUser.campId
      ) {
        throw new BadRequestException('You can only update requests involving your camp');
      }

      if (body.originCampId !== undefined && body.originCampId !== currentUser.campId) {
        throw new BadRequestException('originCampId must match your authenticated camp');
      }

      if (body.createdBy !== undefined && body.createdBy !== currentUser.userId) {
        throw new BadRequestException('createdBy must match the authenticated user');
      }

      const newStatus: IntercampRequestStatus =
        (body.status as IntercampRequestStatus) ?? existingRequest.status;

      if (newStatus !== 'DRAFT' && newStatus !== 'PENDING') {
        const hasRespondedBy =
          body.respondedBy !== undefined && body.respondedBy !== null
            ? true
            : existingRequest.respondedBy !== undefined && existingRequest.respondedBy !== null;

        const hasResponseDate =
          body.responseDate !== undefined && body.responseDate !== null
            ? true
            : existingRequest.responseDate !== undefined && existingRequest.responseDate !== null;

        const missing: string[] = [];
        if (!hasRespondedBy) missing.push('respondedBy');
        if (!hasResponseDate) missing.push('responseDate');

        if (missing.length > 0) {
          throw new BadRequestException(
            `Missing required field(s) for status '${newStatus}': ${missing.join(', ')}`,
          );
        }
      }

      if (newStatus === 'APPROVED') {
        const plannedDeparture = body.plannedDepartureDate ?? existingRequest.plannedDepartureDate;
        const plannedArrival = body.plannedArrivalDate ?? existingRequest.plannedArrivalDate;

        const missingDates: string[] = [];
        if (!plannedDeparture) missingDates.push('plannedDepartureDate');
        if (!plannedArrival) missingDates.push('plannedArrivalDate');

        if (missingDates.length > 0) {
          throw new BadRequestException(
            `Missing required field(s) for status 'APPROVED': ${missingDates.join(', ')}`,
          );
        }

        const dep =
          plannedDeparture instanceof Date ? plannedDeparture : new Date(String(plannedDeparture));
        const arr =
          plannedArrival instanceof Date ? plannedArrival : new Date(String(plannedArrival));
        if (!(arr.getTime() > dep.getTime() + 60_000)) {
          throw new BadRequestException(
            'plannedArrivalDate must be later than plannedDepartureDate by at least 1 minute',
          );
        }
      }

      const request = await this.service.updateRequest(parsedId, body, currentUser);
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Transfer records cannot be deleted for audit reasons.');
  }
}
