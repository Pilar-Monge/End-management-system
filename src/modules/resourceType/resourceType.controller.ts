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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';
import { Roles } from '../../common/decorators';

import { ResourceTypeService } from './resourceType.service';
import type {
  CreateResourceTypeDTO,
  ResourceCategory,
  UpdateResourceTypeDTO,
} from './resourceType.model';

import { CreateResourceTypeDto, UpdateResourceTypeDto } from './dto';
@Controller('resource-types')
@ApiTags('Resource Type')
export class ResourceTypeController {
  constructor(private readonly service: ResourceTypeService) {}
  @Post()
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Create Resource Type' })
  @ApiBody({ type: CreateResourceTypeDto })
  @ApiCreatedResponse({ description: 'Resource Type created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateResourceTypeDTO) {
    throw new ForbiddenException('Resource types are system catalogs and cannot be modified via API');
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Get Resource Type by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Resource Type id' })
  @ApiOkResponse({ description: 'Resource Type found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Resource Type not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const resourceType = await this.service.getResourceTypeById(parsedId);
    if (!resourceType) throw new NotFoundException('Resource type not found');

    return { success: true, data: resourceType };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'List Resource Type' })
  @ApiOkResponse({ description: 'Resource Type list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
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
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Update Resource Type' })
  @ApiParam({ name: 'id', type: Number, description: 'Resource Type id' })
  @ApiBody({ type: UpdateResourceTypeDto })
  @ApiOkResponse({ description: 'Resource Type updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Resource Type not found' })
  async update(@Param('id') id: string, @Body() body: UpdateResourceTypeDTO) {
    throw new ForbiddenException('Resource types are system catalogs and cannot be modified via API');
  }
  @Delete(':id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Delete Resource Type' })
  @ApiParam({ name: 'id', type: Number, description: 'Resource Type id' })
  @ApiOkResponse({ description: 'Resource Type deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Resource Type not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Resource types are system catalogs and cannot be modified via API');
  }
}
