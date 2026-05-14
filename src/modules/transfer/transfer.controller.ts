import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

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

import { TransferService } from './transfer.service';
import type { CreateTransferDTO, TransferStatus, UpdateTransferDTO } from './transfer.model';
import { TransferEntity } from './transfer.entity';
import { CreateTransferDto, UpdateTransferDto } from './dto';
@Controller('transfers')
@ApiTags('Transfer')
export class TransferController {
  constructor(
    private readonly service: TransferService,
    private readonly dataSource: DataSource,
  ) {}

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

  private async assertRequestCampAccess(requestId: number, currentCampId: number): Promise<void> {
    const request = await this.dataSource.query(
      `SELECT id, origin_camp_id, destination_camp_id FROM public.intercamp_request WHERE id = $1 LIMIT 1`,
      [requestId],
    );

    const record = request[0] as
      | { id: number; origin_camp_id: number; destination_camp_id: number }
      | undefined;

    if (!record) {
      throw new NotFoundException('Intercamp request not found');
    }

    if (record.origin_camp_id !== currentCampId && record.destination_camp_id !== currentCampId) {
      throw new BadRequestException('You can only access transfers involving your camp');
    }
  }

  private async assertTransferCampAccess(transferId: number, currentCampId: number): Promise<void> {
    const rows = await this.dataSource.query(
      `SELECT r.origin_camp_id, r.destination_camp_id
       FROM public.transfer t
       JOIN public.intercamp_request r ON r.id = t.request_id
       WHERE t.id = $1
       LIMIT 1`,
      [transferId],
    );

    const scope = rows[0] as { origin_camp_id: number; destination_camp_id: number } | undefined;
    if (!scope) {
      throw new NotFoundException('Transfer not found');
    }

    if (scope.origin_camp_id !== currentCampId && scope.destination_camp_id !== currentCampId) {
      throw new BadRequestException('You can only access transfers involving your camp');
    }
  }

  @Post()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Create Transfer' })
  @ApiBody({ type: CreateTransferDto })
  @ApiCreatedResponseData(TransferEntity, { description: 'Transfer created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateTransferDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        await this.assertRequestCampAccess(body.requestId, currentUser.campId);
      }

      const transfer = await this.service.createTransfer(body);
      return {
        success: true,
        data: transfer,
        message: 'Transfer created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating transfer',
      );
    }
  }
  @Get(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Get Transfer by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiOkResponseData(TransferEntity, { description: 'Transfer found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol)) {
      await this.assertTransferCampAccess(parsedId, currentUser.campId);
    }

    const transfer = await this.service.getTransferById(parsedId);
    if (!transfer) throw new NotFoundException('Transfer not found');

    return { success: true, data: transfer };
  }
  @Get()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'List Transfer' })
  @ApiOkResponseList(TransferEntity, { description: 'Transfer list' })
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
    @Query('requestId') requestId?: string,
    @Query('status') status?: TransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        requestId?: number;
        status?: TransferStatus;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin && !requestId) {
        throw new BadRequestException('Non-admin users must provide requestId');
      }

      if (requestId) {
        const parsedRequestId = Number.parseInt(requestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');

        if (!isAdmin) {
          await this.assertRequestCampAccess(parsedRequestId, currentUser.campId);
        }

        filters.requestId = parsedRequestId;
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

      const result = await this.service.getAllTransfers(filters);
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
        error instanceof Error ? error.message : 'Error getting transfers',
      );
    }
  }
  @Put(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Update Transfer' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiBody({ type: UpdateTransferDto })
  @ApiOkResponseData(TransferEntity, { description: 'Transfer updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string, @Body() body: UpdateTransferDTO, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        await this.assertTransferCampAccess(parsedId, currentUser.campId);
        if (body.requestId !== undefined) {
          await this.assertRequestCampAccess(body.requestId, currentUser.campId);
        }
      }

      const transfer = await this.service.updateTransfer(parsedId, body);
      if (!transfer) throw new NotFoundException('Transfer not found');

      return {
        success: true,
        data: transfer,
        message: 'Transfer updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating transfer',
      );
    }
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Transfer' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiOkResponseMessage({ description: 'Transfer deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Transfer records cannot be deleted for audit reasons.');
  }
}
