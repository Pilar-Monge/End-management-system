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

import { TransferHistoryService } from './transferHistory.service';
import type { CreateTransferHistoryDTO } from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';
import { TransferHistoryEntity } from './transferHistory.entity';

import { CreateTransferHistoryDto } from './dto';
@Controller('transfer-history')
@ApiTags('Transfer History')
export class TransferHistoryController {
  constructor(private readonly service: TransferHistoryService) {}

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
  @ApiOperation({ summary: 'Create Transfer History' })
  @ApiBody({ type: CreateTransferHistoryDto })
  @ApiCreatedResponseData(TransferHistoryEntity, { description: 'Transfer History created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateTransferHistoryDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        if (body.userId !== currentUser.userId) {
          throw new BadRequestException('userId must match the authenticated user');
        }

        await this.service.assertTransferCampAccess(body.transferId, currentUser.campId);
      }

      const entry = await this.service.createEntry(body);
      return {
        success: true,
        data: entry,
        message: 'Transfer history entry created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating transfer history entry',
      );
    }
  }
  @Get(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Get Transfer History by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiOkResponseData(TransferHistoryEntity, { description: 'Transfer History found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer History not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol)) {
      await this.service.assertHistoryCampAccess(parsedId, currentUser.campId);
    }

    const entry = await this.service.getEntryById(parsedId);
    if (!entry) throw new NotFoundException('Transfer history entry not found');

    if (!this.isSystemAdmin(currentUser.rol) && entry.userId !== currentUser.userId) {
      throw new BadRequestException(
        'You do not have permission to view this transfer history entry',
      );
    }

    return { success: true, data: entry };
  }
  @Get()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'List Transfer History' })
  @ApiOkResponseList(TransferHistoryEntity, { description: 'Transfer History list' })
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
    @Query('transferId') transferId?: string,
    @Query('userId') userId?: string,
    @Query('previousStatus') previousStatus?: TransferStatus,
    @Query('newStatus') newStatus?: TransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        transferId?: number;
        userId?: number;
        previousStatus?: TransferStatus;
        newStatus?: TransferStatus;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin) {
        filters.userId = currentUser.userId;
      }

      if (transferId) {
        const parsedTransferId = Number.parseInt(transferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');

        if (!isAdmin) {
          await this.service.assertTransferCampAccess(parsedTransferId, currentUser.campId);
        }

        filters.transferId = parsedTransferId;
      }

      if (userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');

        if (!isAdmin && parsedUserId !== currentUser.userId) {
          throw new BadRequestException('userId filter must match the authenticated user');
        }

        filters.userId = parsedUserId;
      }

      if (previousStatus) {
        filters.previousStatus = previousStatus;
      }

      if (newStatus) {
        filters.newStatus = newStatus;
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

      const result = await this.service.getAllEntries(filters);
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
        error instanceof Error ? error.message : 'Error getting transfer history',
      );
    }
  }
  @Put(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Update Transfer History (disabled for audit immutability)' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiOkResponseMessage({
    description: 'Transfer history is immutable and cannot be updated',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    throw new ForbiddenException('Transfer history records cannot be updated for audit reasons.');
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Transfer History' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiOkResponseMessage({ description: 'Transfer History deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer History not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Transfer records cannot be deleted for audit reasons.');
  }
}
