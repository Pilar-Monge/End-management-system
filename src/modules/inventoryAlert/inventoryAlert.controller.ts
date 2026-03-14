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

import { InventoryAlertService } from './inventoryAlert.service';
import type { CreateInventoryAlertDTO, UpdateInventoryAlertDTO } from './inventoryAlert.model';

@Controller('inventory-alerts')
export class InventoryAlertController {
  constructor(private readonly service: InventoryAlertService) {}

  @Post()
  async create(@Body() body: CreateInventoryAlertDTO) {
    try {
      const alert = await this.service.createAlert(body);
      return {
        success: true,
        data: alert,
        message: 'Inventory alert created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating inventory alert',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const alert = await this.service.getAlertById(parsedId);
    if (!alert) throw new NotFoundException('Inventory alert not found');

    return { success: true, data: alert };
  }

  @Get()
  async getAll(
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('tipoRecursoId') tipoRecursoId?: string,
    @Query('resolved') resolved?: string,
    @Query('resuelta') resuelta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        resourceTypeId?: number;
        resolved?: boolean;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? campamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid camp ID');
        filters.campId = parsedCampId;
      }

      const resolvedResourceTypeId = resourceTypeId ?? tipoRecursoId;
      if (resolvedResourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resolvedResourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resource type ID');
        }
        filters.resourceTypeId = parsedResourceTypeId;
      }

      const resolvedResolved = resolved ?? resuelta;
      if (resolvedResolved !== undefined) {
        if (resolvedResolved !== 'true' && resolvedResolved !== 'false') {
          throw new BadRequestException('Invalid resolved');
        }
        filters.resolved = resolvedResolved === 'true';
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

      const result = await this.service.getAllAlerts(filters);
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
        error instanceof Error ? error.message : 'Error getting inventory alerts',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateInventoryAlertDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const alert = await this.service.updateAlert(parsedId, body);
      if (!alert) throw new NotFoundException('Inventory alert not found');

      return {
        success: true,
        data: alert,
        message: 'Inventory alert updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating inventory alert',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteAlert(parsedId);
      if (!deleted) throw new NotFoundException('Inventory alert not found');

      return { success: true, message: 'Inventory alert deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting inventory alert',
      );
    }
  }
}
