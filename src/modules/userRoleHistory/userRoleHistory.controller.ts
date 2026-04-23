import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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

import { UserRoleHistoryService } from './userRoleHistory.service';
import type { CreateUserRoleHistoryDTO, UpdateUserRoleHistoryDTO } from './userRoleHistory.model';
import { UserRoleHistoryEntity } from './userRoleHistory.entity';
import { CreateUserRoleHistoryDto, UpdateUserRoleHistoryDto } from './dto';

@Controller('user-role-history')
@ApiTags('User Role History')
@Roles('SYSTEM_ADMIN')
export class UserRoleHistoryController {
  constructor(private readonly service: UserRoleHistoryService) {}

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

  @Post()
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Create User Role History' })
  @ApiBody({ type: CreateUserRoleHistoryDto })
  @ApiCreatedResponseData(UserRoleHistoryEntity, { description: 'User Role History created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateUserRoleHistoryDTO) {
    try {
      const entry = await this.service.createEntry(body);
      return {
        success: true,
        data: entry,
        message: 'User role history entry created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating user role history entry',
      );
    }
  }

  @Get(':id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get User Role History by id' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiOkResponseData(UserRoleHistoryEntity, { description: 'User Role History found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    const campId = await this.service.getEntryCampId(parsedId);
    if (campId === null || campId !== currentUser.campId) {
      throw new NotFoundException('User role history entry not found');
    }

    const entry = await this.service.getEntryById(parsedId);
    if (!entry) throw new NotFoundException('User role history entry not found');

    return { success: true, data: entry };
  }

  @Get()
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List User Role History' })
  @ApiOkResponseList(UserRoleHistoryEntity, { description: 'User Role History list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('userId') userId?: string,
    @Query('changedBy') changedBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const filters: {
        userId?: number;
        changedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      if (userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        const campId = await this.service.getUserCampId(parsedUserId);
        if (campId !== null && campId !== currentUser.campId) {
          throw new BadRequestException('You cannot query role history from another camp');
        }
        filters.userId = parsedUserId;
      }

      if (changedBy) {
        const parsedChangedBy = Number.parseInt(changedBy, 10);
        if (Number.isNaN(parsedChangedBy)) throw new BadRequestException('Invalid changedBy');
        const campId = await this.service.getUserCampId(parsedChangedBy);
        if (campId !== null && campId !== currentUser.campId) {
          throw new BadRequestException('You cannot query role history from another camp');
        }
        filters.changedBy = parsedChangedBy;
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

      const result = await this.service.getAllEntries(filters);
      const campScopedData = [] as typeof result.data;

      for (const entry of result.data) {
        const campId = await this.service.getEntryCampId(entry.id);
        if (campId === currentUser.campId) {
          campScopedData.push(entry);
        }
      }

      const resolvedPage = filters.page ?? 1;
      const resolvedLimit = filters.limit ?? 10;

      return {
        success: true,
        data: campScopedData,
        pagination: {
          page: resolvedPage,
          limit: resolvedLimit,
          total: campScopedData.length,
          pages: Math.ceil(campScopedData.length / resolvedLimit),
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting user role history',
      );
    }
  }

  @Put(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Update User Role History' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiBody({ type: UpdateUserRoleHistoryDto })
  @ApiOkResponseData(UserRoleHistoryEntity, { description: 'User Role History updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserRoleHistoryDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const campId = await this.service.getEntryCampId(parsedId);
      if (campId === null || campId !== currentUser.campId) {
        throw new NotFoundException('User role history entry not found');
      }

      const entry = await this.service.updateEntry(parsedId, body);
      if (!entry) throw new NotFoundException('User role history entry not found');

      return {
        success: true,
        data: entry,
        message: 'User role history entry updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating user role history entry',
      );
    }
  }

  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete User Role History' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiOkResponseMessage({ description: 'User Role History deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      const campId = await this.service.getEntryCampId(parsedId);
      if (campId === null || campId !== currentUser.campId) {
        throw new NotFoundException('User role history entry not found');
      }

      const deleted = await this.service.deleteEntry(parsedId);
      if (!deleted) throw new NotFoundException('User role history entry not found');

      return { success: true, message: 'User role history entry deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting user role history entry',
      );
    }
  }
}
