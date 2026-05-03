import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { Roles } from '../../common/decorators';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { DecisionTreeService } from './decisionTree.service';
import type {
  ExplainDecisionTreeDTO,
  PredictDecisionTreeDTO,
  TrainDecisionTreeDTO,
} from './decisionTree.model';

@Controller('decision-tree')
@Roles('SYSTEM_ADMIN')
@ApiTags('Decision Tree')
export class DecisionTreeController {
  constructor(private readonly service: DecisionTreeService) {}

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

  @Post('train')
  @ApiOperation({ summary: 'Train decision tree model' })
  @ApiBody({ type: Object })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async train(@Body() body: TrainDecisionTreeDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      const model = await this.service.trainModel(body, currentUser.campId);
      return {
        success: true,
        data: {
          id: model.id,
          modelName: model.modelName,
          featureNames: model.featureNames,
          trainingMetrics: model.trainingMetrics,
          isActive: model.isActive,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        },
        message: 'Decision tree model trained successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error training decision tree model',
      );
    }
  }

  @Post('predict')
  @ApiOperation({ summary: 'Predict using decision tree model' })
  @ApiBody({ type: Object })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async predict(@Body() body: PredictDecisionTreeDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      const result = await this.service.predict({ ...body, campId: currentUser.campId });
      return {
        success: true,
        data: result,
        message: 'Prediction generated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error generating prediction',
      );
    }
  }

  @Post('explain')
  @ApiOperation({ summary: 'Explain prediction from decision tree model' })
  @ApiBody({ type: Object })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async explain(@Body() body: ExplainDecisionTreeDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      const result = await this.service.explain({ ...body, campId: currentUser.campId });
      return {
        success: true,
        data: result,
        message: 'Prediction explanation generated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error generating explanation',
      );
    }
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get decision tree model by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Model id' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getModelById(@Param('id') id: string, @Req() req: Request) {
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    const currentUser = this.getCurrentUser(req);

    const model = await this.service.getModelById(parsedId, currentUser.campId);
    if (!model) {
      throw new NotFoundException('Decision tree model not found');
    }

    return {
      success: true,
      data: {
        id: model.id,
        modelName: model.modelName,
        featureNames: model.featureNames,
        trainingMetrics: model.trainingMetrics,
        isActive: model.isActive,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
    };
  }

  @Get('models')
  @ApiOperation({ summary: 'List decision tree models' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async listModels(
    @Query('modelName') modelName?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    if (!req) {
      throw new BadRequestException('Request context is required');
    }

    const currentUser = this.getCurrentUser(req);
    const parsedPage = page ? Number.parseInt(page, 10) : 1;
    const parsedLimit = limit ? Number.parseInt(limit, 10) : 10;

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      throw new BadRequestException('Invalid page');
    }

    if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
      throw new BadRequestException('Invalid limit');
    }

    let parsedIsActive: boolean | undefined;
    if (isActive !== undefined) {
      if (isActive !== 'true' && isActive !== 'false') {
        throw new BadRequestException('Invalid isActive; use true or false');
      }

      parsedIsActive = isActive === 'true';
    }

    const filters: {
      modelName?: string;
      isActive?: boolean;
      campId?: number;
      page?: number;
      limit?: number;
    } = {
      campId: currentUser.campId,
      page: parsedPage,
      limit: parsedLimit,
    };

    if (modelName !== undefined) {
      filters.modelName = modelName;
    }

    if (parsedIsActive !== undefined) {
      filters.isActive = parsedIsActive;
    }

    const result = await this.service.listModels(filters);

    return {
      success: true,
      data: result.data,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: result.total,
        pages: Math.ceil(result.total / parsedLimit),
      },
    };
  }
}
