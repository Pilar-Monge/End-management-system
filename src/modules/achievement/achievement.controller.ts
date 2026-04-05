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

import { AchievementService } from './achievement.service';
import type { CreateAchievementDTO, UpdateAchievementDTO } from './achievement.model';
import { AchievementEntity } from './achievement.entity';

import { CreateAchievementDto, UpdateAchievementDto } from './dto';
@Controller('achievements')
@ApiTags('Achievement')
@Roles('SYSTEM_ADMIN')
export class AchievementController {
  constructor(private readonly service: AchievementService) {}
  @Post()
  @ApiOperation({ summary: 'Create Achievement' })
  @ApiBody({ type: CreateAchievementDto })
  @ApiCreatedResponseData(AchievementEntity, { description: 'Achievement created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateAchievementDTO) {
    try {
      const achievement = await this.service.createAchievement(body);
      return {
        success: true,
        data: achievement,
        message: 'Achievement created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating achievement',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Achievement by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Achievement id' })
  @ApiOkResponseData(AchievementEntity, { description: 'Achievement found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Achievement not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const achievement = await this.service.getAchievementById(parsedId);
    if (!achievement) throw new NotFoundException('Achievement not found');
    return { success: true, data: achievement };
  }
  @Get()
  @ApiOperation({ summary: 'List Achievement' })
  @ApiOkResponseList(AchievementEntity, { description: 'Achievement list' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (pagination)',
  })
  async getAll(
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: { name?: string; page?: number; limit?: number } = {};

      if (name) filters.name = name;

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

      const result = await this.service.getAllAchievements(filters);
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
        error instanceof Error ? error.message : 'Error getting achievements',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Achievement' })
  @ApiParam({ name: 'id', type: Number, description: 'Achievement id' })
  @ApiBody({ type: UpdateAchievementDto })
  @ApiOkResponseData(AchievementEntity, { description: 'Achievement updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Achievement not found' })
  async update(@Param('id') id: string, @Body() body: UpdateAchievementDTO) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const achievement = await this.service.updateAchievement(parsedId, body);
      if (!achievement) throw new NotFoundException('Achievement not found');
      return {
        success: true,
        data: achievement,
        message: 'Achievement updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating achievement',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Achievement' })
  @ApiParam({ name: 'id', type: Number, description: 'Achievement id' })
  @ApiOkResponseMessage({ description: 'Achievement deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Achievement not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteAchievement(parsedId);
      if (!deleted) throw new NotFoundException('Achievement not found');
      return { success: true, message: 'Achievement deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting achievement',
      );
    }
  }
}
