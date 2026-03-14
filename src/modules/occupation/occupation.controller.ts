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

import { OccupationService } from './occupation.service';
import type { CreateOccupationDTO, UpdateOccupationDTO } from './occupation.model';

@Controller('occupations')
export class OccupationController {
  constructor(private readonly service: OccupationService) {}

  @Post()
  async create(@Body() body: CreateOccupationDTO) {
    try {
      const occupation = await this.service.createOccupation(body);
      return {
        success: true,
        data: occupation,
        message: 'Occupation created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating occupation',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const occupation = await this.service.getOccupationById(parsedId);
    if (!occupation) throw new NotFoundException('Occupation not found');

    return { success: true, data: occupation };
  }

  @Get()
  async getAll(
    @Query('collectsResources') collectsResources?: string,
    @Query('recolectaRecursos') recolectaRecursos?: string,
    @Query('participatesInExpeditions') participatesInExpeditions?: string,
    @Query('participaExpediciones') participaExpediciones?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('tipoRecursoId') tipoRecursoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        collectsResources?: boolean;
        participatesInExpeditions?: boolean;
        resourceTypeId?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCollects = collectsResources ?? recolectaRecursos;
      if (resolvedCollects !== undefined) {
        if (resolvedCollects !== 'true' && resolvedCollects !== 'false') {
          throw new BadRequestException('Invalid collectsResources');
        }
        filters.collectsResources = resolvedCollects === 'true';
      }

      const resolvedParticipates = participatesInExpeditions ?? participaExpediciones;
      if (resolvedParticipates !== undefined) {
        if (resolvedParticipates !== 'true' && resolvedParticipates !== 'false') {
          throw new BadRequestException('Invalid participatesInExpeditions');
        }
        filters.participatesInExpeditions = resolvedParticipates === 'true';
      }

      const resolvedResourceTypeId = resourceTypeId ?? tipoRecursoId;
      if (resolvedResourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resolvedResourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resourceTypeId');
        }
        filters.resourceTypeId = parsedResourceTypeId;
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

      const result = await this.service.getAllOccupations(filters);
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
        error instanceof Error ? error.message : 'Error getting occupations',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateOccupationDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const occupation = await this.service.updateOccupation(parsedId, body);
      if (!occupation) throw new NotFoundException('Occupation not found');

      return {
        success: true,
        data: occupation,
        message: 'Occupation updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating occupation',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteOccupation(parsedId);
      if (!deleted) throw new NotFoundException('Occupation not found');

      return { success: true, message: 'Occupation deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting occupation',
      );
    }
  }
}
