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
  ApiOkResponseList,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { CampAchievementService } from './campAchievement.service';
import type { CreateCampAchievementDTO, UpdateCampAchievementDTO } from './campAchievement.model';
import { CampAchievementEntity } from './campAchievement.entity';
import { CreateCampAchievementDto, UpdateCampAchievementDto } from './dto';
@Controller('camp-achievements')
@ApiTags('Camp Achievement')
@Roles('SYSTEM_ADMIN', 'WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
export class CampAchievementController {
  constructor(private readonly service: CampAchievementService) {}

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
  @ApiOperation({ summary: 'Create Camp Achievement' })
  @ApiBody({ type: CreateCampAchievementDto })
  @ApiCreatedResponseData(CampAchievementEntity, { description: 'Camp Achievement created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateCampAchievementDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (body.campId !== currentUser.campId) {
        throw new BadRequestException('You cannot create achievements for another camp');
      }

      const campAchievement = await this.service.createCampAchievement(body);
      return {
        success: true,
        data: campAchievement,
        message: 'Camp achievement created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating camp achievement',
      );
    }
  }

  @Get(':campId/:achievementId')
  @ApiOperation({ summary: 'Get Camp Achievement by campId and achievementId' })
  @ApiParam({ name: 'campId', type: Number, description: 'Camp id' })
  @ApiParam({ name: 'achievementId', type: Number, description: 'Achievement id' })
  @ApiBadRequestResponse({ description: 'Invalid campId or achievementId' })
  @ApiNotFoundResponse({ description: 'Camp Achievement not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getByKey(
    @Param('campId') campId: string,
    @Param('achievementId') achievementId: string,
    @Req() req: Request,
  ) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
    }

    const currentUser = this.getCurrentUser(req);
    if (parsedCampId !== currentUser.campId) {
      throw new BadRequestException('You cannot view achievements from another camp');
    }

    const campAchievement = await this.service.getCampAchievementByKey(
      parsedCampId,
      parsedAchievementId,
    );
    if (!campAchievement) throw new NotFoundException('Camp achievement not found');

    return { success: true, data: campAchievement };
  }
  @Get()
  @ApiOperation({ summary: 'List Camp Achievement' })
  @ApiOkResponseList(CampAchievementEntity, { description: 'Camp Achievement list' })
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
    @Query('campId') campId?: string,
    @Query('achievementId') achievementId?: string,
    @Query('unlockedBy') unlockedBy?: string,
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
        campId?: number;
        achievementId?: number;
        unlockedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      filters.campId = currentUser.campId;

      if (campId) {
        const parsedCampId = Number.parseInt(campId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        if (parsedCampId !== currentUser.campId) {
          throw new BadRequestException('You cannot query achievements from another camp');
        }
        filters.campId = parsedCampId;
      }

      if (achievementId) {
        const parsedAchievementId = Number.parseInt(achievementId, 10);
        if (Number.isNaN(parsedAchievementId)) {
          throw new BadRequestException('Invalid achievementId');
        }
        filters.achievementId = parsedAchievementId;
      }

      if (unlockedBy) {
        const parsedUnlockedBy = Number.parseInt(unlockedBy, 10);
        if (Number.isNaN(parsedUnlockedBy)) {
          throw new BadRequestException('Invalid unlockedBy');
        }
        filters.unlockedBy = parsedUnlockedBy;
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

      const result = await this.service.getAllCampAchievements(filters);
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
        error instanceof Error ? error.message : 'Error getting camp achievements',
      );
    }
  }

  @Put(':campId/:achievementId')
  @ApiOperation({ summary: 'Update Camp Achievement' })
  @ApiParam({ name: 'campId', type: Number, description: 'Camp id' })
  @ApiParam({ name: 'achievementId', type: Number, description: 'Achievement id' })
  @ApiBody({ type: UpdateCampAchievementDto })
  @ApiBadRequestResponse({ description: 'Invalid campId, achievementId, or payload' })
  @ApiNotFoundResponse({ description: 'Camp Achievement not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('campId') campId: string,
    @Param('achievementId') achievementId: string,
    @Body() body: UpdateCampAchievementDTO,
    @Req() req: Request,
  ) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
    }

    const currentUser = this.getCurrentUser(req);
    if (parsedCampId !== currentUser.campId) {
      throw new BadRequestException('You cannot update achievements from another camp');
    }

    try {
      const campAchievement = await this.service.updateCampAchievement(
        parsedCampId,
        parsedAchievementId,
        body,
      );
      if (!campAchievement) throw new NotFoundException('Camp achievement not found');

      return {
        success: true,
        data: campAchievement,
        message: 'Camp achievement updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating camp achievement',
      );
    }
  }

  @Delete(':campId/:achievementId')
  @ApiOperation({ summary: 'Delete Camp Achievement' })
  @ApiParam({ name: 'campId', type: Number, description: 'Camp id' })
  @ApiParam({ name: 'achievementId', type: Number, description: 'Achievement id' })
  @ApiBadRequestResponse({ description: 'Invalid campId or achievementId' })
  @ApiNotFoundResponse({ description: 'Camp Achievement not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(
    @Param('campId') campId: string,
    @Param('achievementId') achievementId: string,
    @Req() req: Request,
  ) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
    }

    const currentUser = this.getCurrentUser(req);
    if (parsedCampId !== currentUser.campId) {
      throw new BadRequestException('You cannot delete achievements from another camp');
    }

    try {
      const deleted = await this.service.deleteCampAchievement(parsedCampId, parsedAchievementId);
      if (!deleted) throw new NotFoundException('Camp achievement not found');

      return { success: true, message: 'Camp achievement deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting camp achievement',
      );
    }
  }

  @Get('latest-unlocks')
  @ApiOperation({ summary: 'Get latest unlocked achievements for the current camp' })
  async getLatestUnlocks(@Req() req: Request, @Query('limit') limit?: string) {
    const currentUser = this.getCurrentUser(req);
    const parsedLimit = limit ? Number.parseInt(limit, 10) : 5;
    const data = await this.service.getLatestUnlocks(currentUser.campId, parsedLimit);
    return { success: true, data };
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get achievement progress for the current camp' })
  async getProgress(@Req() req: Request) {
    const currentUser = this.getCurrentUser(req);
    const data = await this.service.getAchievementProgress(currentUser.campId);
    return { success: true, data };
  }

  @Post(':achievementId/seen')
  @ApiOperation({ summary: 'Mark an achievement as seen to avoid repeated animations' })
  async markAsSeen(@Param('achievementId') achievementId: string, @Req() req: Request) {
    const currentUser = this.getCurrentUser(req);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedAchievementId)) throw new BadRequestException('Invalid achievementId');

    const result = await this.service.markAchievementAsSeen(
      currentUser.campId,
      parsedAchievementId,
    );
    if (!result) throw new NotFoundException('Camp achievement not found');

    return { success: true, message: 'Achievement marked as seen' };
  }
}
