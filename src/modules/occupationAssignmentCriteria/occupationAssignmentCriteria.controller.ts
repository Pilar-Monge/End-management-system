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

import { OccupationAssignmentCriteriaService } from './occupationAssignmentCriteria.service';
import type {
  CreateOccupationAssignmentCriteriaDTO,
  OccupationCriteriaEvaluatedField,
  UpdateOccupationAssignmentCriteriaDTO,
} from './occupationAssignmentCriteria.model';

@Controller('occupation-assignment-criteria')
export class OccupationAssignmentCriteriaController {
  constructor(private readonly service: OccupationAssignmentCriteriaService) {}

  @Post()
  async create(@Body() body: CreateOccupationAssignmentCriteriaDTO) {
    try {
      const criteria = await this.service.createCriteria(body);
      return {
        success: true,
        data: criteria,
        message: 'Criteria created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating criteria',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const criteria = await this.service.getCriteriaById(parsedId);
    if (!criteria) throw new NotFoundException('Criteria not found');

    return { success: true, data: criteria };
  }

  @Get()
  async getAll(
    @Query('occupationId') occupationId?: string,
    @Query('ocupacionId') ocupacionId?: string,
    @Query('evaluatedField') evaluatedField?: OccupationCriteriaEvaluatedField,
    @Query('campoEvaluado') campoEvaluado?: OccupationCriteriaEvaluatedField,
    @Query('active') active?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        occupationId?: number;
        evaluatedField?: OccupationCriteriaEvaluatedField;
        active?: boolean;
        page?: number;
        limit?: number;
      } = {};

      const resolvedOccupationId = occupationId ?? ocupacionId;
      if (resolvedOccupationId) {
        const parsedOccupationId = Number.parseInt(resolvedOccupationId, 10);
        if (Number.isNaN(parsedOccupationId)) {
          throw new BadRequestException('Invalid occupationId');
        }
        filters.occupationId = parsedOccupationId;
      }

      const resolvedEvaluatedField = evaluatedField ?? campoEvaluado;
      if (resolvedEvaluatedField) {
        filters.evaluatedField = resolvedEvaluatedField;
      }

      const resolvedActive = active ?? activo;
      if (resolvedActive !== undefined) {
        if (resolvedActive !== 'true' && resolvedActive !== 'false') {
          throw new BadRequestException('Invalid active');
        }
        filters.active = resolvedActive === 'true';
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

      const result = await this.service.getAllCriteria(filters);
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
        error instanceof Error ? error.message : 'Error getting criteria',
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOccupationAssignmentCriteriaDTO,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const criteria = await this.service.updateCriteria(parsedId, body);
      if (!criteria) throw new NotFoundException('Criteria not found');

      return {
        success: true,
        data: criteria,
        message: 'Criteria updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating criteria',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteCriteria(parsedId);
      if (!deleted) throw new NotFoundException('Criteria not found');

      return { success: true, message: 'Criteria deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting criteria',
      );
    }
  }
}
