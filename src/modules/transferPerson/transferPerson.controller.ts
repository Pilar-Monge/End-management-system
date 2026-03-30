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


import { TransferPersonService } from './transferPerson.service';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  UpdateTransferPersonDTO,
} from './transferPerson.model';

import { CreateTransferPersonDto, UpdateTransferPersonDto } from './dto';
@Controller('transfer-persons')
@ApiTags('Transfer Person')
export class TransferPersonController {
  constructor(private readonly service: TransferPersonService) {}
  @Post()
  @ApiOperation({ summary: 'Create Transfer Person' })
  @ApiBody({ type: CreateTransferPersonDto })
  @ApiCreatedResponse({ description: 'Transfer Person created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateTransferPersonDTO) {
    try {
      const transferPerson = await this.service.createTransferPerson(body);
      return {
        success: true,
        data: transferPerson,
        message: 'Transfer person created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating transfer person',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Transfer Person by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiOkResponse({ description: 'Transfer Person found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const transferPerson = await this.service.getTransferPersonById(parsedId);
    if (!transferPerson) throw new NotFoundException('Transfer person not found');

    return { success: true, data: transferPerson };
  }
  @Get()
  @ApiOperation({ summary: 'List Transfer Person' })
  @ApiOkResponse({ description: 'Transfer Person list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('transferId') transferId?: string,
    @Query('trasladoId') trasladoId?: string,
    @Query('personId') personId?: string,
    @Query('personaId') personaId?: string,
    @Query('status') status?: PersonTransferStatus,
    @Query('estado') estado?: PersonTransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        transferId?: number;
        personId?: number;
        status?: PersonTransferStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedTransferId = transferId ?? trasladoId;
      if (resolvedTransferId) {
        const parsedTransferId = Number.parseInt(resolvedTransferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');
        filters.transferId = parsedTransferId;
      }

      const resolvedPersonId = personId ?? personaId;
      if (resolvedPersonId) {
        const parsedPersonId = Number.parseInt(resolvedPersonId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid personId');
        filters.personId = parsedPersonId;
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

      const result = await this.service.getAllTransferPeople(filters);
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
        error instanceof Error ? error.message : 'Error getting transfer people',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Transfer Person' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiBody({ type: UpdateTransferPersonDto })
  @ApiOkResponse({ description: 'Transfer Person updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  async update(@Param('id') id: string, @Body() body: UpdateTransferPersonDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const transferPerson = await this.service.updateTransferPerson(parsedId, body);
      if (!transferPerson) throw new NotFoundException('Transfer person not found');

      return {
        success: true,
        data: transferPerson,
        message: 'Transfer person updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating transfer person',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Transfer Person' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiOkResponse({ description: 'Transfer Person deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteTransferPerson(parsedId);
      if (!deleted) throw new NotFoundException('Transfer person not found');

      return { success: true, message: 'Transfer person deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting transfer person',
      );
    }
  }
}
