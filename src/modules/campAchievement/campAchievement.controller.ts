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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';
import { Roles } from '../../common/decorators';

import { CampAchievementService } from './campAchievement.service';
import type { CreateCampAchievementDTO, UpdateCampAchievementDTO } from './campAchievement.model';

import { CreateCampAchievementDto, UpdateCampAchievementDto } from './dto';
@Controller('camp-achievements')
@ApiTags('Camp Achievement')
@Roles('SYSTEM_ADMIN')
export class CampAchievementController {
  constructor(private readonly service: CampAchievementService) {}
  @Post()
  @ApiOperation({ summary: 'Create Camp Achievement' })
  @ApiBody({ type: CreateCampAchievementDto })
  @ApiCreatedResponse({ description: 'Camp Achievement created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateCampAchievementDTO) {
    try {
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
  async getByKey(@Param('campId') campId: string, @Param('achievementId') achievementId: string) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
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
  @ApiOkResponse({ description: 'Camp Achievement list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('campId') campId?: string,
    @Query('campamentoId') campamentoId?: string,
    @Query('achievementId') achievementId?: string,
    @Query('logroId') logroId?: string,
    @Query('unlockedBy') unlockedBy?: string,
    @Query('desbloqueadoPor') desbloqueadoPor?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyCampamentoId =
        typeof req?.query?.campamentoId === 'string'
          ? (req.query.campamentoId as string)
          : undefined;

      const filters: {
        campId?: number;
        achievementId?: number;
        unlockedBy?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? legacyCampamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) throw new BadRequestException('Invalid campId');
        filters.campId = parsedCampId;
      }

      const resolvedAchievementId = achievementId ?? logroId;
      if (resolvedAchievementId) {
        const parsedAchievementId = Number.parseInt(resolvedAchievementId, 10);
        if (Number.isNaN(parsedAchievementId)) {
          throw new BadRequestException('Invalid achievementId');
        }
        filters.achievementId = parsedAchievementId;
      }

      const resolvedUnlockedBy = unlockedBy ?? desbloqueadoPor;
      if (resolvedUnlockedBy) {
        const parsedUnlockedBy = Number.parseInt(resolvedUnlockedBy, 10);
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
  async update(
    @Param('campId') campId: string,
    @Param('achievementId') achievementId: string,
    @Body() body: UpdateCampAchievementDTO,
  ) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
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
  async delete(@Param('campId') campId: string, @Param('achievementId') achievementId: string) {
    const parsedCampId = Number.parseInt(campId, 10);
    const parsedAchievementId = Number.parseInt(achievementId, 10);
    if (Number.isNaN(parsedCampId) || Number.isNaN(parsedAchievementId)) {
      throw new BadRequestException('Invalid campId or achievementId');
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
}
