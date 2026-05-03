import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';
import { NotificationService } from './notification.service';
import type {
  CreateNotificationDTO,
  NotificationType,
  UpdateNotificationDTO,
} from './notification.model';
import { SystemRole, type SystemRole as SystemRoleType } from '../systemUser/systemUser.model';
import { NotificationEntity } from './notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

type NotificationFilters = {
  campId?: number;
  userId?: number;
  targetRole?: SystemRoleType;
  type?: NotificationType;
  read?: boolean;
  page?: number;
  limit?: number;
};

@Controller('notifications')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  private getCurrentUser(req: Request): { userId: number; campId: number } {
    const currentUser = req.user as { userId?: number; campId?: number } | undefined;
    if (
      typeof currentUser?.userId !== 'number' ||
      currentUser.userId <= 0 ||
      typeof currentUser.campId !== 'number' ||
      currentUser.campId <= 0
    ) {
      throw new BadRequestException('Authenticated user context is invalid');
    }

    return {
      userId: currentUser.userId,
      campId: currentUser.campId,
    };
  }

  @Post()
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.RESOURCE_MANAGEMENT, SystemRole.TRAVEL_MANAGER)
  @ApiOperation({ summary: 'Create Notification manually' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponseData(NotificationEntity, { description: 'Notification created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateNotificationDTO) {
    try {
      const notification = await this.service.createNotification(body);
      return { success: true, data: notification, message: 'Notification created successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating notification',
      );
    }
  }

  @Get(':id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.WORKER,
    SystemRole.RESOURCE_MANAGEMENT,
    SystemRole.TRAVEL_MANAGER,
    SystemRole.VISITOR,
  )
  @ApiOperation({ summary: 'Get Notification by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponseData(NotificationEntity)
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const notification = await this.service.getNotificationById(parsedId);
    if (!notification) throw new NotFoundException('Notification not found');

    const currentUser = this.getCurrentUser(req);
    // STRICT OWNERSHIP CHECK: Applies to EVERYONE including ADMIN
    if (notification.userId && notification.userId !== currentUser.userId) {
      throw new BadRequestException('You do not have permission to view this notification');
    }

    if (notification.campId !== currentUser.campId) {
      throw new BadRequestException('You do not have permission to view this notification');
    }

    return { success: true, data: notification };
  }

  @Get()
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.WORKER,
    SystemRole.RESOURCE_MANAGEMENT,
    SystemRole.TRAVEL_MANAGER,
    SystemRole.VISITOR,
  )
  @ApiOperation({ summary: 'List Notification' })
  @ApiOkResponseList(NotificationEntity)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAll(
    @Query('campId') campId?: string,
    @Query('targetRole') targetRole?: SystemRoleType,
    @Query('type') type?: NotificationType,
    @Query('read') read?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: NotificationFilters = {};
      if (!req) {
        throw new BadRequestException('Request context is required');
      }
      const currentUser = this.getCurrentUser(req);

      // STRICT FILTER: Users can ONLY see their own notifications, NO EXCEPTIONS
      filters.userId = currentUser.userId;
      filters.campId = currentUser.campId;

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (!Number.isNaN(parsedCampId) && parsedCampId !== currentUser.campId) {
          throw new BadRequestException('You cannot query notifications from another camp');
        }
      }
      if (targetRole) filters.targetRole = targetRole;
      if (type) filters.type = type;
      if (read !== undefined) filters.read = read === 'true';

      if (page) {
        const parsedPage = Number.parseInt(page, 10);
        if (!Number.isNaN(parsedPage) && parsedPage > 0) filters.page = parsedPage;
      }
      if (limit) {
        const parsedLimit = Number.parseInt(limit, 10);
        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) filters.limit = parsedLimit;
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
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.WORKER,
    SystemRole.RESOURCE_MANAGEMENT,
    SystemRole.TRAVEL_MANAGER,
    SystemRole.VISITOR,
  )
  @ApiOperation({ summary: 'Update/Mark Notification as read' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiOkResponseData(NotificationEntity)
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(@Param('id') id: string, @Body() body: UpdateNotificationDTO, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const existingNotification = await this.service.getNotificationById(parsedId);
      if (!existingNotification) throw new NotFoundException('Notification not found');

      const currentUser = this.getCurrentUser(req);
      // STRICT OWNERSHIP CHECK: Applies to EVERYONE including ADMIN
      if (existingNotification.userId && existingNotification.userId !== currentUser.userId) {
        throw new BadRequestException('You can only update your own notifications');
      }

      if (existingNotification.campId !== currentUser.campId) {
        throw new BadRequestException('You can only update notifications from your camp');
      }

      const notification = await this.service.updateNotification(parsedId, body);
      return { success: true, data: notification, message: 'Notification updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating notification',
      );
    }
  }

  @Delete(':id')
  @Roles(SystemRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete Notification (DISABLED)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete() {
    // HARD LOCK: Endpoint exists for API completeness but throws 403 Forbidden for everyone.
    throw new ForbiddenException(
      'Deleting notifications is strictly disabled for auditing and compliance purposes.',
    );
  }
}
