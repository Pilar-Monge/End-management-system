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
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';

import { RequestResourceDetailService } from './requestResourceDetail.service';
import type {
  CreateRequestResourceDetailDTO,
  UpdateRequestResourceDetailDTO,
} from './requestResourceDetail.model';
import { RequestResourceDetailEntity } from './requestResourceDetail.entity';

import { CreateRequestResourceDetailDto, UpdateRequestResourceDetailDto } from './dto';
@Controller('request-resource-details')
@ApiTags('Request Resource Detail')
@Roles('SYSTEM_ADMIN')
export class RequestResourceDetailController {
  constructor(private readonly service: RequestResourceDetailService) {}

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

  private async assertRequestCampAccess(requestId: number, currentCampId: number): Promise<void> {
    const scope = await this.service.getRequestScope(requestId);
    if (!scope) {
      throw new NotFoundException('Intercamp request not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException(
        'You can only access request resource details involving your camp',
      );
    }
  }

  private async assertDetailCampAccess(detailId: number, currentCampId: number): Promise<void> {
    const scope = await this.service.getDetailScope(detailId);
    if (!scope) {
      throw new NotFoundException('Request resource detail not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException(
        'You can only access request resource details involving your camp',
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Request Resource Detail' })
  @ApiBody({ type: CreateRequestResourceDetailDto })
  @ApiCreatedResponseData(RequestResourceDetailEntity, {
    description: 'Request Resource Detail created',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateRequestResourceDetailDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      await this.assertRequestCampAccess(body.requestId, currentUser.campId);

      const detail = await this.service.createDetail(body);
      return {
        success: true,
        data: detail,
        message: 'Request resource detail created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating request resource detail',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Request Resource Detail by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Resource Detail id' })
  @ApiOkResponseData(RequestResourceDetailEntity, { description: 'Request Resource Detail found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Resource Detail not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    await this.assertDetailCampAccess(parsedId, currentUser.campId);

    const detail = await this.service.getDetailById(parsedId);
    if (!detail) throw new NotFoundException('Request resource detail not found');

    return { success: true, data: detail };
  }
  @Get()
  @ApiOperation({ summary: 'List Request Resource Detail' })
  @ApiOkResponseList(RequestResourceDetailEntity, { description: 'Request Resource Detail list' })
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
    @Query('requestId') requestId?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
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
        requestId?: number;
        resourceTypeId?: number;
        involvedCampId?: number;
        page?: number;
        limit?: number;
      } = {};

      filters.involvedCampId = currentUser.campId;

      if (requestId) {
        const parsedRequestId = Number.parseInt(requestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');
        await this.assertRequestCampAccess(parsedRequestId, currentUser.campId);
        filters.requestId = parsedRequestId;
      }

      if (resourceTypeId) {
        const parsedResourceTypeId = Number.parseInt(resourceTypeId, 10);
        if (Number.isNaN(parsedResourceTypeId)) {
          throw new BadRequestException('Invalid resourceTypeId');
        }
        filters.resourceTypeId = parsedResourceTypeId;
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

      const result = await this.service.getAllDetails(filters);
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
        error instanceof Error ? error.message : 'Error getting request resource details',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Request Resource Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Resource Detail id' })
  @ApiBody({ type: UpdateRequestResourceDetailDto })
  @ApiOkResponseData(RequestResourceDetailEntity, {
    description: 'Request Resource Detail updated',
  })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Request Resource Detail not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRequestResourceDetailDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      await this.assertDetailCampAccess(parsedId, currentUser.campId);
      if (body.requestId !== undefined) {
        await this.assertRequestCampAccess(body.requestId, currentUser.campId);
      }

      const detail = await this.service.updateDetail(parsedId, body);
      if (!detail) throw new NotFoundException('Request resource detail not found');

      return {
        success: true,
        data: detail,
        message: 'Request resource detail updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating request resource detail',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Request Resource Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Resource Detail id' })
  @ApiOkResponseMessage({ description: 'Request Resource Detail deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Resource Detail not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      await this.assertDetailCampAccess(parsedId, currentUser.campId);

      const deleted = await this.service.deleteDetail(parsedId);
      if (!deleted) throw new NotFoundException('Request resource detail not found');

      return {
        success: true,
        message: 'Request resource detail deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting request resource detail',
      );
    }
  }
}
