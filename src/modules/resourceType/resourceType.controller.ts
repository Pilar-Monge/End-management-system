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

import { ResourceTypeService } from './resourceType.service';
import type {
  CreateResourceTypeDTO,
  ResourceCategory,
  UpdateResourceTypeDTO,
} from './resourceType.model';

@Controller('resource-types')
export class ResourceTypeController {
  constructor(private readonly service: ResourceTypeService) {}

  @Post()
  async create(@Body() body: CreateResourceTypeDTO) {
    try {
      const resourceType = await this.service.createResourceType(body);
      return {
        success: true,
        data: resourceType,
        message: 'Resource type created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating resource type',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const resourceType = await this.service.getResourceTypeById(parsedId);
    if (!resourceType) throw new NotFoundException('Resource type not found');

    return { success: true, data: resourceType };
  }

  @Get()
  async getAll(
    @Query('category') category?: ResourceCategory,
    @Query('categoria') categoria?: ResourceCategory,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        category?: ResourceCategory;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCategory = category ?? categoria;
      if (resolvedCategory) {
        filters.category = resolvedCategory;
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

      const result = await this.service.getAllResourceTypes(filters);
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
        error instanceof Error ? error.message : 'Error getting resource types',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateResourceTypeDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const resourceType = await this.service.updateResourceType(parsedId, body);
      if (!resourceType) throw new NotFoundException('Resource type not found');

      return {
        success: true,
        data: resourceType,
        message: 'Resource type updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating resource type',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteResourceType(parsedId);
      if (!deleted) throw new NotFoundException('Resource type not found');

      return { success: true, message: 'Resource type deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting resource type',
      );
    }
  }
}
