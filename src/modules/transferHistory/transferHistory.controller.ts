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


import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { TransferHistoryService } from './transferHistory.service';
import type {
  CreateTransferHistoryDTO,
  UpdateTransferHistoryDTO,
} from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';

import { CreateTransferHistoryDto, UpdateTransferHistoryDto } from './dto';
@Controller('transfer-history')
@ApiTags('Transfer History')
export class TransferHistoryController {
  constructor(private readonly service: TransferHistoryService) {}
  @Post()
  @ApiOperation({ summary: 'Create Transfer History' })
  @ApiBody({ type: CreateTransferHistoryDto })
  @ApiCreatedResponse({ description: 'Transfer History created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateTransferHistoryDTO) {
    try {
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
  @ApiOperation({ summary: 'Get Transfer History by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiOkResponse({ description: 'Transfer History found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer History not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const entry = await this.service.getEntryById(parsedId);
    if (!entry) throw new NotFoundException('Transfer history entry not found');

    return { success: true, data: entry };
  }
  @Get()
  @ApiOperation({ summary: 'List Transfer History' })
  @ApiOkResponse({ description: 'Transfer History list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('transferId') transferId?: string,
    @Query('transferenciaId') transferenciaId?: string,
    @Query('userId') userId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('previousStatus') previousStatus?: TransferStatus,
    @Query('estadoAnterior') estadoAnterior?: TransferStatus,
    @Query('newStatus') newStatus?: TransferStatus,
    @Query('estadoNuevo') estadoNuevo?: TransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyUsuarioId = typeof req?.query?.usuarioId === 'string' ? (req.query.usuarioId as string) : undefined;

      const filters: {
        transferId?: number;
        userId?: number;
        previousStatus?: TransferStatus;
        newStatus?: TransferStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedTransferId = transferId ?? transferenciaId;
      if (resolvedTransferId) {
        const parsedTransferId = Number.parseInt(resolvedTransferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');
        filters.transferId = parsedTransferId;
      }

      const resolvedUserId = userId ?? legacyUsuarioId;
      if (resolvedUserId) {
        const parsedUserId = Number.parseInt(resolvedUserId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      const resolvedPreviousStatus = previousStatus ?? estadoAnterior;
      if (resolvedPreviousStatus) {
        filters.previousStatus = resolvedPreviousStatus;
      }

      const resolvedNewStatus = newStatus ?? estadoNuevo;
      if (resolvedNewStatus) {
        filters.newStatus = resolvedNewStatus;
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
  @ApiOperation({ summary: 'Update Transfer History' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiBody({ type: UpdateTransferHistoryDto })
  @ApiOkResponse({ description: 'Transfer History updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Transfer History not found' })
  async update(@Param('id') id: string, @Body() body: UpdateTransferHistoryDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const entry = await this.service.updateEntry(parsedId, body);
      if (!entry) throw new NotFoundException('Transfer history entry not found');

      return {
        success: true,
        data: entry,
        message: 'Transfer history entry updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating transfer history entry',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Transfer History' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer History id' })
  @ApiOkResponse({ description: 'Transfer History deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer History not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteEntry(parsedId);
      if (!deleted) throw new NotFoundException('Transfer history entry not found');

      return { success: true, message: 'Transfer history entry deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting transfer history entry',
      );
    }
  }
}
