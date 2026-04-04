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


import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';


import { ExpeditionParticipantService } from './expeditionParticipant.service';
import type {
  CreateExpeditionParticipantDTO,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';
import { ExpeditionParticipantEntity } from './expeditionParticipant.entity';

import { CreateExpeditionParticipantDto, UpdateExpeditionParticipantDto } from './dto';
@Controller('expedition-participants')
@ApiTags('Expedition Participant')
export class ExpeditionParticipantController {
  constructor(private readonly service: ExpeditionParticipantService) {}
  @Post()
  @ApiCreatedResponseData(ExpeditionParticipantEntity, { description: 'Expedition Participant created' })
  @ApiOperation({ summary: 'Create Expedition Participant' })
  @ApiBody({ type: CreateExpeditionParticipantDto })
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
  @ApiOkResponseData(ExpeditionParticipantEntity, { description: 'Expedition Participant found' })
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
  @ApiOkResponseList(ExpeditionParticipantEntity, { description: 'Expedition Participant list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('expeditionId') expeditionId?: string,
    @Query('personId') personId?: string,
    @Query('status') status?: ParticipantStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        expeditionId?: number;
        personId?: number;
        status?: ParticipantStatus;
        page?: number;
        limit?: number;
      } = {};

      if (expeditionId) {
        const parsedExpeditionId = Number.parseInt(expeditionId, 10);
        if (Number.isNaN(parsedExpeditionId)) {
          throw new BadRequestException('Invalid expeditionId');
        }
        filters.expeditionId = parsedExpeditionId;
      }

      if (personId) {
        const parsedPersonId = Number.parseInt(personId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid personId');
        filters.personId = parsedPersonId;
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
  @ApiOkResponseData(ExpeditionParticipantEntity, { description: 'Expedition Participant updated' })
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
  @ApiOkResponseMessage({ description: 'Expedition Participant deleted' })
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
