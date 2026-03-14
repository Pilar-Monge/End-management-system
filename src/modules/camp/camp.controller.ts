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

import { CampService } from './camp.service';
import type { CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';

@Controller('camps')
export class CampController {
  constructor(private readonly service: CampService) {}

  @Post()
  async create(@Body() body: CreateCampDTO) {
    try {
      const camp = await this.service.createCamp(body);
      return {
        success: true,
        data: camp,
        message: 'Camp created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating camp',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const camp = await this.service.getCampById(parsedId);
    if (!camp) throw new NotFoundException('Camp not found');

    return { success: true, data: camp };
  }

  @Get()
  async getAll(
    @Query('estado') estado?: CampStatus,
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
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting camps',
      );
    }
  }

  @Put(':id')
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
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating camp',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteCamp(parsedId);
      if (!deleted) throw new NotFoundException('Camp not found');

      return { success: true, message: 'Camp deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting camp',
      );
    }
  }
}
