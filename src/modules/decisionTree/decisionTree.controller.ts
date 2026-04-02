import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';

import { DecisionTreeService } from './decisionTree.service';
import type {
  ExplainDecisionTreeDTO,
  PredictDecisionTreeDTO,
  TrainDecisionTreeDTO,
} from './decisionTree.model';

@Controller('decision-tree')
@Roles('SYSTEM_ADMIN')
export class DecisionTreeController {
  constructor(private readonly service: DecisionTreeService) {}

  @Post('train')
  async train(@Body() body: TrainDecisionTreeDTO) {
    try {
      const model = await this.service.trainModel(body);
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
  async predict(@Body() body: PredictDecisionTreeDTO) {
    try {
      const result = await this.service.predict(body);
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
  async explain(@Body() body: ExplainDecisionTreeDTO) {
    try {
      const result = await this.service.explain(body);
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
  async getModelById(@Param('id') id: string) {
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID');
    }

    const model = await this.service.getModelById(parsedId);
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
  async listModels(
    @Query('modelName') modelName?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
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
      page?: number;
      limit?: number;
    } = {
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
