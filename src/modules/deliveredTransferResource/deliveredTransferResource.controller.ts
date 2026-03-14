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

import { DeliveredTransferResourceService } from './deliveredTransferResource.service';
import type {
  CreateDeliveredTransferResourceDTO,
  UpdateDeliveredTransferResourceDTO,
} from './deliveredTransferResource.model';

@Controller('delivered-transfer-resources')
export class DeliveredTransferResourceController {
  constructor(private readonly service: DeliveredTransferResourceService) {}

  @Post()
  async create(@Body() body: CreateDeliveredTransferResourceDTO) {
    try {
      const delivered = await this.service.createDeliveredResource(body);
      return {
        success: true,
        data: delivered,
        message: 'Delivered transfer resource created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error creating delivered transfer resource',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const delivered = await this.service.getDeliveredResourceById(parsedId);
    if (!delivered) throw new NotFoundException('Delivered transfer resource not found');

    return { success: true, data: delivered };
  }

  @Get()
  async getAll(
    @Query('transferId') transferId?: string,
    @Query('trasladoId') trasladoId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('tipoRecursoId') tipoRecursoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        transferId?: number;
        resourceTypeId?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedTransferId = transferId ?? trasladoId;
      if (resolvedTransferId) {
        const parsedTransferId = Number.parseInt(resolvedTransferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');
        filters.transferId = parsedTransferId;
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

      const result = await this.service.getAllDeliveredResources(filters);
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
          : 'Error getting delivered transfer resources',
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDeliveredTransferResourceDTO,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const delivered = await this.service.updateDeliveredResource(parsedId, body);
      if (!delivered) {
        throw new NotFoundException('Delivered transfer resource not found');
      }

      return {
        success: true,
        data: delivered,
        message: 'Delivered transfer resource updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating delivered transfer resource',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteDeliveredResource(parsedId);
      if (!deleted) {
        throw new NotFoundException('Delivered transfer resource not found');
      }

      return {
        success: true,
        message: 'Delivered transfer resource deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error deleting delivered transfer resource',
      );
    }
  }
}
