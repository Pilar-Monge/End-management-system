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


import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserRoleHistoryService } from './userRoleHistory.service';
import type {
  CreateUserRoleHistoryDTO,
  UpdateUserRoleHistoryDTO,
} from './userRoleHistory.model';

import { CreateUserRoleHistoryDto, UpdateUserRoleHistoryDto } from './dto';
@Controller('user-role-history')
@ApiTags('User Role History')
export class UserRoleHistoryController {
  constructor(private readonly service: UserRoleHistoryService) {}
  @Post()
  @ApiOperation({ summary: 'Create User Role History' })
  @ApiBody({ type: CreateUserRoleHistoryDto })
  @ApiCreatedResponse({ description: 'User Role History created' })
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
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating user role history entry',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get User Role History by id' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiOkResponse({ description: 'User Role History found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const entry = await this.service.getEntryById(parsedId);
    if (!entry) throw new NotFoundException('User role history entry not found');

    return { success: true, data: entry };
  }
  @Get()
  @ApiOperation({ summary: 'List User Role History' })
  @ApiOkResponse({ description: 'User Role History list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('userId') userId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('changedBy') changedBy?: string,
    @Query('cambiadoPor') cambiadoPor?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyUsuarioId = typeof req?.query?.usuarioId === 'string' ? (req.query.usuarioId as string) : undefined;

      const filters: {
        userId?: number;
        changedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedUserId = userId ?? legacyUsuarioId;
      if (resolvedUserId) {
        const parsedUserId = Number.parseInt(resolvedUserId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      const resolvedChangedBy = changedBy ?? cambiadoPor;
      if (resolvedChangedBy) {
        const parsedChangedBy = Number.parseInt(resolvedChangedBy, 10);
        if (Number.isNaN(parsedChangedBy)) throw new BadRequestException('Invalid changedBy');
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
        error instanceof Error ? error.message : 'Error getting user role history',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update User Role History' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiBody({ type: UpdateUserRoleHistoryDto })
  @ApiOkResponse({ description: 'User Role History updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async update(@Param('id') id: string, @Body() body: UpdateUserRoleHistoryDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const entry = await this.service.updateEntry(parsedId, body);
      if (!entry) throw new NotFoundException('User role history entry not found');

      return {
        success: true,
        data: entry,
        message: 'User role history entry updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating user role history entry',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User Role History' })
  @ApiParam({ name: 'id', type: Number, description: 'User Role History id' })
  @ApiOkResponse({ description: 'User Role History deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User Role History not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
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
