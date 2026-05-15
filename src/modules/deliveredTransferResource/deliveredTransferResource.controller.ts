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
import type { Request } from 'express';


import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { DeliveredTransferResourceService } from './deliveredTransferResource.service';
import type { CreateDeliveredTransferResourceDTO } from './deliveredTransferResource.model';
import { DeliveredTransferResourceEntity } from './deliveredTransferResource.entity';

import { CreateDeliveredTransferResourceDto } from './dto';
@Controller('delivered-transfer-resources')
@ApiTags('Delivered Transfer Resource')
export class DeliveredTransferResourceController {
  constructor(private readonly service: DeliveredTransferResourceService) {}

  private getCurrentUser(req: Request): { userId: number; campId: number; rol: string } {
    const currentUser = req.user as { userId?: number; campId?: number; rol?: string } | undefined;

    if (
      typeof currentUser?.userId !== 'number' ||
      currentUser.userId <= 0 ||
      typeof currentUser.campId !== 'number' ||
      currentUser.campId <= 0 ||
      typeof currentUser.rol !== 'string' ||
      !currentUser.rol
    ) {
      throw new BadRequestException('Authenticated user context is invalid');
    }

    return {
      userId: currentUser.userId,
      campId: currentUser.campId,
      rol: currentUser.rol,
    };
  }

  private isSystemAdmin(rol: string): boolean {
    return rol === 'SYSTEM_ADMIN';
  }


  @Post()
  @Roles('RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Create Delivered Transfer Resource' })
  @ApiBody({ type: CreateDeliveredTransferResourceDto })
  @ApiCreatedResponseData(DeliveredTransferResourceEntity, {
    description: 'Delivered Transfer Resource created',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateDeliveredTransferResourceDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        if (body.recordedBy !== currentUser.userId) {
          throw new BadRequestException('recordedBy must match the authenticated user');
        }

        await this.service.assertTransferCampAccess(body.transferId, currentUser.campId);
      }

      const delivered = await this.service.createDeliveredResource(body);
      return {
        success: true,
        data: delivered,
        message: 'Delivered transfer resource created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating delivered transfer resource',
      );
    }
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Get Delivered Transfer Resource by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Delivered Transfer Resource id' })
  @ApiOkResponseData(DeliveredTransferResourceEntity, {
    description: 'Delivered Transfer Resource found',
  })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Delivered Transfer Resource not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol)) {
      await this.service.assertDeliveredCampAccess(parsedId, currentUser.campId);
    }

    const delivered = await this.service.getDeliveredResourceById(parsedId);
    if (!delivered) throw new NotFoundException('Delivered transfer resource not found');

    if (!this.isSystemAdmin(currentUser.rol) && delivered.recordedBy !== currentUser.userId) {
      throw new BadRequestException('You do not have permission to view this delivered resource');
    }

    return { success: true, data: delivered };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'List Delivered Transfer Resource' })
  @ApiOkResponseList(DeliveredTransferResourceEntity, {
    description: 'Delivered Transfer Resource list',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAll(
    @Query('transferId') transferId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        transferId?: number;
        resourceTypeId?: number;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin && !transferId) {
        throw new BadRequestException('Non-admin users must provide transferId');
      }

      if (transferId) {
        const parsedTransferId = Number.parseInt(transferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');

        if (!isAdmin) {
          await this.service.assertTransferCampAccess(parsedTransferId, currentUser.campId);
        }

        filters.transferId = parsedTransferId;
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

      const result = await this.service.getAllDeliveredResources(filters);
      const resolvedPage = filters.page ?? 1;
      const resolvedLimit = filters.limit ?? 10;

      const data = !isAdmin
        ? result.data.filter((item) => item.recordedBy === currentUser.userId)
        : result.data;
      const total = !isAdmin ? data.length : result.total;

      return {
        success: true,
        data,
        pagination: {
          page: resolvedPage,
          limit: resolvedLimit,
          total,
          pages: Math.ceil(total / resolvedLimit),
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting delivered transfer resources',
      );
    }
  }
  @Put(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Update Delivered Transfer Resource (disabled for audit immutability)' })
  @ApiParam({ name: 'id', type: Number, description: 'Delivered Transfer Resource id' })
  @ApiOkResponseMessage({
    description: 'Delivered transfer resource is immutable and cannot be updated',
  })
  async update(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    throw new ForbiddenException(
      'Delivered transfer resource records cannot be updated for audit reasons.',
    );
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Delivered Transfer Resource' })
  @ApiParam({ name: 'id', type: Number, description: 'Delivered Transfer Resource id' })
  @ApiOkResponseMessage({ description: 'Delivered Transfer Resource deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Delivered Transfer Resource not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException('Transfer records cannot be deleted for audit reasons.');
  }
}
