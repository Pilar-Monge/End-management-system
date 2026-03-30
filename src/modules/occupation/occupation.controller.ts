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

import { OccupationService } from './occupation.service';
import type { CreateOccupationDTO, UpdateOccupationDTO } from './occupation.model';

import { CreateOccupationDto, UpdateOccupationDto } from './dto';
@Controller('occupations')
@ApiTags('Occupation')
export class OccupationController {
  constructor(private readonly service: OccupationService) {}
  @Post()
  @ApiOperation({ summary: 'Create Occupation' })
  @ApiBody({ type: CreateOccupationDto })
  @ApiCreatedResponse({ description: 'Occupation created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
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
  @ApiOperation({ summary: 'Get Occupation by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiOkResponse({ description: 'Occupation found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Occupation not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const occupation = await this.service.getOccupationById(parsedId);
    if (!occupation) throw new NotFoundException('Occupation not found');

    return { success: true, data: occupation };
  }
  @Get()
  @ApiOperation({ summary: 'List Occupation' })
  @ApiOkResponse({ description: 'Occupation list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
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
  @ApiOperation({ summary: 'Update Occupation' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiBody({ type: UpdateOccupationDto })
  @ApiOkResponse({ description: 'Occupation updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Occupation not found' })
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
  @ApiOperation({ summary: 'Delete Occupation' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiOkResponse({ description: 'Occupation deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Occupation not found' })
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
