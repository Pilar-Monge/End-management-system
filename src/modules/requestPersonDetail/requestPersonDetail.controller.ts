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

import { RequestPersonDetailService } from './requestPersonDetail.service';
import type {
  CreateRequestPersonDetailDTO,
  PersonDetailStatus,
  PersonDetailType,
  UpdateRequestPersonDetailDTO,
} from './requestPersonDetail.model';
import { RequestPersonDetailEntity } from './requestPersonDetail.entity';

import { CreateRequestPersonDetailDto, UpdateRequestPersonDetailDto } from './dto';
@Controller('request-person-details')
@ApiTags('Request Person Detail')
export class RequestPersonDetailController {
  constructor(private readonly service: RequestPersonDetailService) {}

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
        'You can only access request person details involving your camp',
      );
    }
  }

  private async assertDetailCampAccess(detailId: number, currentCampId: number): Promise<void> {
    const scope = await this.service.getDetailScope(detailId);
    if (!scope) {
      throw new NotFoundException('Request person detail not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException(
        'You can only access request person details involving your camp',
      );
    }
  }

  @Post()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Create Request Person Detail' })
  @ApiBody({ type: CreateRequestPersonDetailDto })
  @ApiCreatedResponseData(RequestPersonDetailEntity, {
    description: 'Request Person Detail created',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateRequestPersonDetailDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      await this.assertRequestCampAccess(body.requestId, currentUser.campId);

      const detail = await this.service.createDetail(body);
      return {
        success: true,
        data: detail,
        message: 'Request person detail created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating request person detail',
      );
    }
  }
  @Get(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get Request Person Detail by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiOkResponseData(RequestPersonDetailEntity, { description: 'Request Person Detail found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    await this.assertDetailCampAccess(parsedId, currentUser.campId);

    const detail = await this.service.getDetailById(parsedId);
    if (!detail) throw new NotFoundException('Request person detail not found');

    return { success: true, data: detail };
  }
  @Get()
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List Request Person Detail' })
  @ApiOkResponseList(RequestPersonDetailEntity, { description: 'Request Person Detail list' })
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
    @Query('detailType') detailType?: PersonDetailType,
    @Query('status') status?: PersonDetailStatus,
    @Query('personId') personId?: string,
    @Query('occupationId') occupationId?: string,
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
        detailType?: PersonDetailType;
        status?: PersonDetailStatus;
        personId?: number;
        occupationId?: number;
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

      if (detailType) {
        filters.detailType = detailType;
      }

      if (status) {
        filters.status = status;
      }

      if (personId) {
        const parsedPersonId = Number.parseInt(personId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid personId');
        filters.personId = parsedPersonId;
      }

      if (occupationId) {
        const parsedOccupationId = Number.parseInt(occupationId, 10);
        if (Number.isNaN(parsedOccupationId)) {
          throw new BadRequestException('Invalid occupationId');
        }
        filters.occupationId = parsedOccupationId;
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
        error instanceof Error ? error.message : 'Error getting request person details',
      );
    }
  }
  @Put(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Update Request Person Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiBody({ type: UpdateRequestPersonDetailDto })
  @ApiOkResponseData(RequestPersonDetailEntity, { description: 'Request Person Detail updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRequestPersonDetailDTO,
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
      if (!detail) throw new NotFoundException('Request person detail not found');

      return {
        success: true,
        data: detail,
        message: 'Request person detail updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating request person detail',
      );
    }
  }
  @Delete(':id')
  @Roles('RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Delete Request Person Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiOkResponseMessage({ description: 'Request Person Detail deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
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
      if (!deleted) throw new NotFoundException('Request person detail not found');

      return { success: true, message: 'Request person detail deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting request person detail',
      );
    }
  }
}
