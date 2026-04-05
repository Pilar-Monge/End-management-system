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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { OccupationService } from './occupation.service';
import type { CreateOccupationDTO, UpdateOccupationDTO } from './occupation.model';
import { OccupationEntity } from './occupation.entity';

import { CreateOccupationDto, UpdateOccupationDto } from './dto';
@Controller('occupations')
@ApiTags('Occupation')
export class OccupationController {
  constructor(private readonly service: OccupationService) {}
  @Post()
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Create Occupation' })
  @ApiBody({ type: CreateOccupationDto })
  @ApiCreatedResponseData(OccupationEntity, { description: 'Occupation created' })
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
  @Roles('SYSTEM_ADMIN', 'WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'VISITOR')
  @ApiOperation({ summary: 'Get Occupation by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiOkResponseData(OccupationEntity, { description: 'Occupation found' })
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
  @Roles('SYSTEM_ADMIN', 'WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'VISITOR')
  @ApiOperation({ summary: 'List Occupation' })
  @ApiOkResponseList(OccupationEntity, { description: 'Occupation list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('collectsResources') collectsResources?: string,
    @Query('participatesInExpeditions') participatesInExpeditions?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
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

      if (collectsResources !== undefined) {
        if (collectsResources !== 'true' && collectsResources !== 'false') {
          throw new BadRequestException('Invalid collectsResources');
        }
        filters.collectsResources = collectsResources === 'true';
      }

      if (participatesInExpeditions !== undefined) {
        if (participatesInExpeditions !== 'true' && participatesInExpeditions !== 'false') {
          throw new BadRequestException('Invalid participatesInExpeditions');
        }
        filters.participatesInExpeditions = participatesInExpeditions === 'true';
      }

      if (resourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resourceTypeId, 10);
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
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Update Occupation' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiBody({ type: UpdateOccupationDto })
  @ApiOkResponseData(OccupationEntity, { description: 'Occupation updated' })
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
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Delete Occupation' })
  @ApiParam({ name: 'id', type: Number, description: 'Occupation id' })
  @ApiOkResponseMessage({ description: 'Occupation deleted' })
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
