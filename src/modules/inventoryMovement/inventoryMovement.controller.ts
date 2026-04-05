import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { Roles } from '../../common/decorators';

import { InventoryMovementService } from './inventoryMovement.service';
import type {
  CreateInventoryMovementDTO,
  InventoryMovementType,
  UpdateInventoryMovementDTO,
} from './inventoryMovement.model';
import { InventoryMovementEntity } from './inventoryMovement.entity';

import { CreateInventoryMovementDto, UpdateInventoryMovementDto } from './dto';
@Controller('inventory-movements')
@ApiTags('Inventory Movement')
export class InventoryMovementController {
  constructor(private readonly service: InventoryMovementService) {}
  @Post()
  @Roles('WORKER', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Create Inventory Movement' })
  @ApiBody({ type: CreateInventoryMovementDto })
  @ApiCreatedResponseData(InventoryMovementEntity, { description: 'Inventory Movement created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateInventoryMovementDTO) {
    try {
      const movement = await this.service.createMovement(body);
      return {
        success: true,
        data: movement,
        message: 'Inventory movement created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating inventory movement',
      );
    }
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'WORKER')
  @ApiOperation({ summary: 'Get Inventory Movement by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Inventory Movement id' })
  @ApiOkResponseData(InventoryMovementEntity, { description: 'Inventory Movement found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Inventory Movement not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const movement = await this.service.getMovementById(parsedId);
    if (!movement) throw new NotFoundException('Inventory movement not found');

    return { success: true, data: movement };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'WORKER')
  @ApiOperation({ summary: 'List Inventory Movement' })
  @ApiOkResponseList(InventoryMovementEntity, { description: 'Inventory Movement list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('campId') campId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('movementType') movementType?: InventoryMovementType,
    @Query('recordedBy') recordedBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        resourceTypeId?: number;
        movementType?: InventoryMovementType;
        recordedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid camp ID');
        filters.campId = parsedCampId;
      }

      if (resourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resource type ID');
        }
        filters.resourceTypeId = parsedResourceTypeId;
      }

      if (movementType) {
        filters.movementType = movementType;
      }

      if (recordedBy) {
        const parsedRecordedBy = Number.parseInt(recordedBy, 10);
        if (Number.isNaN(parsedRecordedBy)) {
          throw new BadRequestException('Invalid recordedBy');
        }
        filters.recordedBy = parsedRecordedBy;
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

      const result = await this.service.getAllMovements(filters);
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
        error instanceof Error ? error.message : 'Error getting inventory movements',
      );
    }
  }
  @Put(':id')
  @Roles('RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Update Inventory Movement' })
  @ApiParam({ name: 'id', type: Number, description: 'Inventory Movement id' })
  @ApiBody({ type: UpdateInventoryMovementDto })
  @ApiOkResponseData(InventoryMovementEntity, { description: 'Inventory Movement updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Inventory Movement not found' })
  async update(@Param('id') id: string, @Body() body: UpdateInventoryMovementDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const movement = await this.service.updateMovement(parsedId, body);
      if (!movement) throw new NotFoundException('Inventory movement not found');

      return {
        success: true,
        data: movement,
        message: 'Inventory movement updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating inventory movement',
      );
    }
  }
  @Delete(':id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Delete Inventory Movement' })
  @ApiParam({ name: 'id', type: Number, description: 'Inventory Movement id' })
  @ApiOkResponseMessage({ description: 'Inventory Movement deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Inventory Movement not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Inventory movements cannot be deleted for audit reasons');
  }
}
