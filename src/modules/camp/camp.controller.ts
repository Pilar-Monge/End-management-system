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
import { CampService } from './camp.service';
import type { CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';
import { CampEntity } from './camp.entity';

import { CreateCampDto, UpdateCampDto } from './dto';
@Controller('camps')
@ApiTags('Camp')
@Roles('SYSTEM_ADMIN')
export class CampController {
  constructor(private readonly service: CampService) {}
  @Post()
  @ApiOperation({ summary: 'Create Camp' })
  @ApiBody({ type: CreateCampDto })
  @ApiCreatedResponseData(CampEntity, { description: 'Camp created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateCampDTO) {
    try {
      const camp = await this.service.createCamp(body);
      return {
        success: true,
        data: camp,
        message: 'Camp created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating camp');
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Camp by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiOkResponseData(CampEntity, { description: 'Camp found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const camp = await this.service.getCampById(parsedId);
    if (!camp) throw new NotFoundException('Camp not found');

    return { success: true, data: camp };
  }
  @Get()
  @ApiOperation({ summary: 'List Camp' })
  @ApiOkResponseList(CampEntity, { description: 'Camp list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('status') status?: CampStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        status?: CampStatus;
        page?: number;
        limit?: number;
      } = {};

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

      const result = await this.service.getAllCamps(filters);
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
      throw new BadRequestException(error instanceof Error ? error.message : 'Error getting camps');
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Camp' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiBody({ type: UpdateCampDto })
  @ApiOkResponseData(CampEntity, { description: 'Camp updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  async update(@Param('id') id: string, @Body() body: UpdateCampDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const camp = await this.service.updateCamp(parsedId, body);
      if (!camp) throw new NotFoundException('Camp not found');

      return {
        success: true,
        data: camp,
        message: 'Camp updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error updating camp');
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Camp' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiOkResponseMessage({ description: 'Camp deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteCamp(parsedId);
      if (!deleted) throw new NotFoundException('Camp not found');

      return { success: true, message: 'Camp deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error deleting camp');
    }
  }
}
