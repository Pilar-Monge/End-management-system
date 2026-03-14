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

import { ExpeditionParticipantService } from './expeditionParticipant.service';
import type {
  CreateExpeditionParticipantDTO,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';

@Controller('expedition-participants')
export class ExpeditionParticipantController {
  constructor(private readonly service: ExpeditionParticipantService) {}

  @Post()
  async create(@Body() body: CreateExpeditionParticipantDTO) {
    try {
      const participant = await this.service.createParticipant(body);
      return {
        success: true,
        data: participant,
        message: 'Expedition participant created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating expedition participant',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const participant = await this.service.getParticipantById(parsedId);
    if (!participant) throw new NotFoundException('Expedition participant not found');

    return { success: true, data: participant };
  }

  @Get()
  async getAll(
    @Query('expeditionId') expeditionId?: string,
    @Query('expedicionId') expedicionId?: string,
    @Query('personId') personId?: string,
    @Query('personaId') personaId?: string,
    @Query('status') status?: ParticipantStatus,
    @Query('estado') estado?: ParticipantStatus,
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

      const resolvedStatus = status ?? estado;
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
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating expedition participant',
      );
    }
  }

  @Delete(':id')
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
