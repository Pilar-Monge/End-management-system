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

import { NotificationService } from './notification.service';
import type {
  CreateNotificationDTO,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';
import type { SystemRole } from '../systemUser/systemUser.model';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  async create(@Body() body: CreateNotificationDTO) {
    try {
      const notification = await this.service.createNotification(body);
      return {
        success: true,
        data: notification,
        message: 'Notification created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating notification',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const notification = await this.service.getNotificationById(parsedId);
    if (!notification) throw new NotFoundException('Notification not found');
    return { success: true, data: notification };
  }

  @Get()
  async getAll(
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('userId') userId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('targetRole') targetRole?: SystemRole,
    @Query('rolObjetivo') rolObjetivo?: SystemRole,
    @Query('type') type?: NotificationType,
    @Query('tipo') tipo?: NotificationType,
    @Query('read') read?: string,
    @Query('leida') leida?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        userId?: number;
        targetRole?: SystemRole;
        type?: NotificationType;
        read?: boolean;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? campamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        filters.campId = parsedCampId;
      }

      const resolvedUserId = userId ?? usuarioId;
      if (resolvedUserId) {
        const parsedUserId = Number.parseInt(resolvedUserId, 10);
        if (Number.isNaN(parsedUserId)) throw new BadRequestException('Invalid userId');
        filters.userId = parsedUserId;
      }

      const resolvedTargetRole = targetRole ?? rolObjetivo;
      if (resolvedTargetRole) {
        filters.targetRole = resolvedTargetRole;
      }

      const resolvedType = type ?? tipo;
      if (resolvedType) {
        filters.type = resolvedType;
      }

      const resolvedRead = read ?? leida;
      if (resolvedRead !== undefined) {
        if (resolvedRead === 'true' || resolvedRead === 'false') {
          filters.read = resolvedRead === 'true';
        } else {
          throw new BadRequestException('Invalid read value (use true/false)');
        }
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

      const result = await this.service.getAllNotifications(filters);
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
        error instanceof Error ? error.message : 'Error getting notifications',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateNotificationDTO) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const notification = await this.service.updateNotification(parsedId, body);
      if (!notification) throw new NotFoundException('Notification not found');

      return {
        success: true,
        data: notification,
        message: 'Notification updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating notification',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteNotification(parsedId);
      if (!deleted) throw new NotFoundException('Notification not found');

      return { success: true, message: 'Notification deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting notification',
      );
    }
  }
}
