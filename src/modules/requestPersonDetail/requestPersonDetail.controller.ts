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


import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../../common/dto/api-response.dto';


import { RequestPersonDetailService } from './requestPersonDetail.service';
import type {
  CreateRequestPersonDetailDTO,
  PersonDetailStatus,
  PersonDetailType,
  UpdateRequestPersonDetailDTO,
} from './requestPersonDetail.model';

import { CreateRequestPersonDetailDto, UpdateRequestPersonDetailDto } from './dto';
@Controller('request-person-details')
@ApiTags('Request Person Detail')
export class RequestPersonDetailController {
  constructor(private readonly service: RequestPersonDetailService) {}
  @Post()
  @ApiOperation({ summary: 'Create Request Person Detail' })
  @ApiBody({ type: CreateRequestPersonDetailDto })
  @ApiCreatedResponse({ description: 'Request Person Detail created', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(@Body() body: CreateRequestPersonDetailDTO) {
    try {
      const detail = await this.service.createDetail(body);
      return {
        success: true,
        data: detail,
        message: 'Request person detail created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error creating request person detail',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Request Person Detail by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiOkResponse({ description: 'Request Person Detail found', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const detail = await this.service.getDetailById(parsedId);
    if (!detail) throw new NotFoundException('Request person detail not found');

    return { success: true, data: detail };
  }
  @Get()
  @ApiOperation({ summary: 'List Request Person Detail' })
  @ApiOkResponse({ description: 'Request Person Detail list', type: SuccessListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  async getAll(
    @Query('requestId') requestId?: string,
    @Query('solicitudId') solicitudId?: string,
    @Query('detailType') detailType?: PersonDetailType,
    @Query('tipoDetalle') tipoDetalle?: PersonDetailType,
    @Query('status') status?: PersonDetailStatus,
    @Query('estado') estado?: PersonDetailStatus,
    @Query('personId') personId?: string,
    @Query('personaId') personaId?: string,
    @Query('occupationId') occupationId?: string,
    @Query('ocupacionId') ocupacionId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    try {
      const legacyEstado = typeof req?.query?.estado === 'string' ? (req.query.estado as string) : undefined;

      const filters: {
        requestId?: number;
        detailType?: PersonDetailType;
        status?: PersonDetailStatus;
        personId?: number;
        occupationId?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedRequestId = requestId ?? solicitudId;
      if (resolvedRequestId) {
        const parsedRequestId = Number.parseInt(resolvedRequestId, 10);
        if (Number.isNaN(parsedRequestId)) throw new BadRequestException('Invalid requestId');
        filters.requestId = parsedRequestId;
      }

      const resolvedDetailType = detailType ?? tipoDetalle;
      if (resolvedDetailType) {
        filters.detailType = resolvedDetailType;
      }

      const resolvedStatus = status ?? (legacyEstado as any);
      if (resolvedStatus) {
        filters.status = resolvedStatus;
      }

      const resolvedPersonId = personId ?? personaId;
      if (resolvedPersonId) {
        const parsedPersonId = Number.parseInt(resolvedPersonId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid personId');
        filters.personId = parsedPersonId;
      }

      const resolvedOccupationId = occupationId ?? ocupacionId;
      if (resolvedOccupationId) {
        const parsedOccupationId = Number.parseInt(resolvedOccupationId, 10);
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
        error instanceof Error
          ? error.message
          : 'Error getting request person details',
      );
    }
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update Request Person Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiBody({ type: UpdateRequestPersonDetailDto })
  @ApiOkResponse({ description: 'Request Person Detail updated', type: SuccessDataResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
  async update(@Param('id') id: string, @Body() body: UpdateRequestPersonDetailDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const detail = await this.service.updateDetail(parsedId, body);
      if (!detail) throw new NotFoundException('Request person detail not found');

      return {
        success: true,
        data: detail,
        message: 'Request person detail updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error updating request person detail',
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Request Person Detail' })
  @ApiParam({ name: 'id', type: Number, description: 'Request Person Detail id' })
  @ApiOkResponse({ description: 'Request Person Detail deleted', type: SuccessMessageResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Request Person Detail not found' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deleteDetail(parsedId);
      if (!deleted) throw new NotFoundException('Request person detail not found');

      return { success: true, message: 'Request person detail deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error deleting request person detail',
      );
    }
  }
}
