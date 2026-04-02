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

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';

import { TransferService } from './transfer.service';
import type {
  CreateTransferDTO,
  TransferStatus,
  UpdateTransferDTO,
} from './transfer.model';

import { CreateTransferDto, UpdateTransferDto } from './dto';
@Controller('transfers')
@ApiTags('Transfer')
export class TransferController {
  constructor(private readonly service: TransferService) {}
  @Post()
  @ApiOperation({ summary: 'Create Transfer' })
  @ApiBody({ type: CreateTransferDto })
  @ApiCreatedResponse({ description: 'Transfer created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateTransferDTO) {
    try {
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
  @ApiOperation({ summary: 'Get Transfer by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiOkResponse({ description: 'Transfer found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const transfer = await this.service.getTransferById(parsedId);
    if (!transfer) throw new NotFoundException('Transfer not found');

    return { success: true, data: transfer };
  }
  @Get()
  @ApiOperation({ summary: 'List Transfer' })
  @ApiOkResponse({ description: 'Transfer list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('requestId') requestId?: string,
    @Query('solicitudId') solicitudId?: string,
    @Query('status') status?: TransferStatus,
    @Query('estado') estado?: TransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        requestId?: number;
        status?: TransferStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedRequestId = requestId ?? solicitudId;
      if (resolvedRequestId) {
        const parsedRequestId = Number.parseInt(resolvedRequestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');
        filters.requestId = parsedRequestId;
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
  @ApiOperation({ summary: 'Update Transfer' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiBody({ type: UpdateTransferDto })
  @ApiOkResponse({ description: 'Transfer updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  async update(@Param('id') id: string, @Body() body: UpdateTransferDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
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
  @ApiOperation({ summary: 'Delete Transfer' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer id' })
  @ApiOkResponse({ description: 'Transfer deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteTransfer(parsedId);
      if (!deleted) throw new NotFoundException('Transfer not found');

      return { success: true, message: 'Transfer deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting transfer',
      );
    }
  }
}
