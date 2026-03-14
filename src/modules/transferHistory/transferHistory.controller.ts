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
} from '@nestjs/common';

import { TransferHistoryService } from './transferHistory.service';
import type {
  CreateTransferHistoryDTO,
  UpdateTransferHistoryDTO,
} from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';

@Controller('transfer-history')
export class TransferHistoryController {
  constructor(private readonly service: TransferHistoryService) {}

  @Post()
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
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const entry = await this.service.getEntryById(parsedId);
    if (!entry) throw new NotFoundException('Transfer history entry not found');

    return { success: true, data: entry };
  }

  @Get()
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

      const resolvedTransferId = transferId ?? transferenciaId;
      if (resolvedTransferId) {
        const parsedTransferId = Number.parseInt(resolvedTransferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');
        filters.transferId = parsedTransferId;
      }

      const resolvedUserId = userId ?? usuarioId;
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
