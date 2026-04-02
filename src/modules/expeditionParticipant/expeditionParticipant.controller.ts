import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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


import { ExpeditionParticipantService } from './expeditionParticipant.service';
import type {
  CreateExpeditionParticipantDTO,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';

import { CreateExpeditionParticipantDto, UpdateExpeditionParticipantDto } from './dto';
@Controller('expedition-participants')
@ApiTags('Expedition Participant')
export class ExpeditionParticipantController {
  constructor(private readonly service: ExpeditionParticipantService) {}
  @Post()
  @ApiOperation({ summary: 'Create Expedition Participant' })
  @ApiBody({ type: CreateExpeditionParticipantDto })
  @ApiCreatedResponse({ description: 'Expedition Participant created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateExpeditionParticipantDTO) {
    try {
      const participant = await this.service.createParticipant(body);
      return {
        success: true,
        data: participant,
        message: 'Expedition participant created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating expedition participant',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Expedition Participant by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Participant id' })
  @ApiOkResponse({ description: 'Expedition Participant found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Participant not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const participant = await this.service.getParticipantById(parsedId);
    if (!participant) throw new NotFoundException('Expedition participant not found');

    return { success: true, data: participant };
  }
  @Get()
  @ApiOperation({ summary: 'List Expedition Participant' })
  @ApiOkResponse({ description: 'Expedition Participant list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('expeditionId') expeditionId?: string,
    @Query('expedicionId') expedicionId?: string,
    @Query('personId') personId?: string,
    @Query('personaId') personaId?: string,
    @Query('status') status?: ParticipantStatus,
    @Query('estado') estado?: ParticipantStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        expeditionId?: number;
        personId?: number;
        status?: ParticipantStatus;
        page?: number;
        limit?: number;
      } = {};

      const resolvedExpeditionId = expeditionId ?? expedicionId;
      if (resolvedExpeditionId) {
        const parsedExpeditionId = Number.parseInt(resolvedExpeditionId, 10);
        if (Number.isNaN(parsedExpeditionId)) {
          throw new BadRequestException('Invalid expeditionId');
        }
        filters.expeditionId = parsedExpeditionId;
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

      const result = await this.service.getAllParticipants(filters);
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
        error instanceof Error
          ? error.message
          : 'Error getting expedition participants',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Expedition Participant' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Participant id' })
  @ApiBody({ type: UpdateExpeditionParticipantDto })
  @ApiOkResponse({ description: 'Expedition Participant updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Expedition Participant not found' })
  async update(@Param('id') id: string, @Body() body: UpdateExpeditionParticipantDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const participant = await this.service.updateParticipant(parsedId, body);
      if (!participant) throw new NotFoundException('Expedition participant not found');

      return {
        success: true,
        data: participant,
        message: 'Expedition participant updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating expedition participant',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Expedition Participant' })
  @ApiParam({ name: 'id', type: Number, description: 'Expedition Participant id' })
  @ApiOkResponse({ description: 'Expedition Participant deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Expedition Participant not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteParticipant(parsedId);
      if (!deleted) throw new NotFoundException('Expedition participant not found');

      return {
        success: true,
        message: 'Expedition participant deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error deleting expedition participant',
      );
    }
  }
}
