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
import { CampService } from './camp.service';
import type { CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';
import { CampEntity } from './camp.entity';

import { CreateCampDto, UpdateCampDto } from './dto';
@Controller('camps')
@ApiTags('Camp')
export class CampController {
  constructor(private readonly service: CampService) {}

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
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Create Camp' })
  @ApiBody({ type: CreateCampDto })
  @ApiCreatedResponseData(CampEntity, { description: 'Camp created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateCampDTO) {
    throw new ForbiddenException(
      'Creating, updating, or deleting camps is strictly disabled via API endpoints for auditing and system integrity purposes. Use seeders instead.',
    );
    try {
      const camp = await this.service.createCamp(body);
      return {
        success: true,
        data: camp,
        message: 'Camp created successfully',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException((error as Error).message);
      }
      throw new BadRequestException('Error creating camp');
    }
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Get Camp by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiOkResponseData(CampEntity, { description: 'Camp found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol) && parsedId !== currentUser.campId) {
      throw new BadRequestException('You do not have permission to view this camp');
    }

    const camp = await this.service.getCampById(parsedId);
    if (!camp) throw new NotFoundException('Camp not found');

    return { success: true, data: camp };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAll(
    @Query('status') status?: CampStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin) {
        const ownCamp = await this.service.getCampById(currentUser.campId);
        if (!ownCamp) {
          throw new NotFoundException('Camp not found');
        }

        return {
          success: true,
          data: [ownCamp],
          pagination: {
            page: 1,
            limit: 1,
            total: 1,
            pages: 1,
          },
        };
      }

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
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Update Camp' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiBody({ type: UpdateCampDto })
  @ApiOkResponseData(CampEntity, { description: 'Camp updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  async update(@Param('id') id: string, @Body() body: UpdateCampDTO) {
    throw new ForbiddenException(
      'Creating, updating, or deleting camps is strictly disabled via API endpoints for auditing and system integrity purposes',
    );
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException((error as Error).message);
      }
      throw new BadRequestException('Error updating camp');
    }
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Camp' })
  @ApiParam({ name: 'id', type: Number, description: 'Camp id' })
  @ApiOkResponseMessage({ description: 'Camp deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Camp not found' })
  async delete(@Param('id') id: string) {
    throw new ForbiddenException(
      'Creating, updating, or deleting camps is strictly disabled via API endpoints for auditing and system integrity purposes. Use seeders instead.',
    );
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteCamp(parsedId);
      if (!deleted) throw new NotFoundException('Camp not found');

      return { success: true, message: 'Camp deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException((error as Error).message);
      }
      throw new BadRequestException('Error deleting camp');
    }
  }
}
