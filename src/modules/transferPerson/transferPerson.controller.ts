import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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

import { TransferPersonService } from './transferPerson.service';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  UpdateTransferPersonDTO,
} from './transferPerson.model';
import { TransferPersonEntity } from './transferPerson.entity';

import { CreateTransferPersonDto, UpdateTransferPersonDto } from './dto';
@Controller('transfer-persons')
@ApiTags('Transfer Person')
export class TransferPersonController {
  constructor(private readonly service: TransferPersonService) {}

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

  private isSystemAdmin(rol: string): boolean {
    return rol === 'SYSTEM_ADMIN';
  }

  // Scope checks moved to TransferPersonService

  @Post()
  @Roles('TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Create Transfer Person' })
  @ApiBody({ type: CreateTransferPersonDto })
  @ApiCreatedResponseData(TransferPersonEntity, { description: 'Transfer Person created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() body: CreateTransferPersonDTO, @Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        await this.service.assertTransferCampAccess(body.transferId, currentUser.campId);
      }

      const transferPerson = await this.service.createTransferPerson(body);
      return {
        success: true,
        data: transferPerson,
        message: 'Transfer person created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating transfer person',
      );
    }
  }
  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'Get Transfer Person by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiOkResponseData(TransferPersonEntity, { description: 'Transfer Person found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const currentUser = this.getCurrentUser(req);
    if (!this.isSystemAdmin(currentUser.rol)) {
      await this.service.assertTransferPersonCampAccess(parsedId, currentUser.campId);
    }

    const transferPerson = await this.service.getTransferPersonById(parsedId);
    if (!transferPerson) throw new NotFoundException('Transfer person not found');

    return { success: true, data: transferPerson };
  }
  @Get()
  @Roles('SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER')
  @ApiOperation({ summary: 'List Transfer Person' })
  @ApiOkResponseList(TransferPersonEntity, { description: 'Transfer Person list' })
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
    @Query('transferId') transferId?: string,
    @Query('personId') personId?: string,
    @Query('status') status?: PersonTransferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    try {
      const filters: {
        transferId?: number;
        personId?: number;
        status?: PersonTransferStatus;
        page?: number;
        limit?: number;
      } = {};

      if (!req) {
        throw new BadRequestException('Request context is required');
      }

      const currentUser = this.getCurrentUser(req);
      const isAdmin = this.isSystemAdmin(currentUser.rol);

      if (!isAdmin && !transferId) {
        throw new BadRequestException('Non-admin users must provide transferId');
      }

      if (transferId) {
        const parsedTransferId = Number.parseInt(transferId, 10);
        if (Number.isNaN(parsedTransferId)) throw new BadRequestException('Invalid transferId');

        if (!isAdmin) {
          await this.service.assertTransferCampAccess(parsedTransferId, currentUser.campId);
        }

        filters.transferId = parsedTransferId;
      }

      if (personId) {
        const parsedPersonId = Number.parseInt(personId, 10);
        if (Number.isNaN(parsedPersonId)) throw new BadRequestException('Invalid personId');
        filters.personId = parsedPersonId;
      }

      if (status) {
        filters.status = status;
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

      const result = await this.service.getAllTransferPeople(filters);
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
        error instanceof Error ? error.message : 'Error getting transfer people',
      );
    }
  }
  @Put(':id')
  @Roles('TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT')
  @ApiOperation({ summary: 'Update Transfer Person' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiBody({ type: UpdateTransferPersonDto })
  @ApiOkResponseData(TransferPersonEntity, { description: 'Transfer Person updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTransferPersonDTO,
    @Req() req: Request,
  ) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const currentUser = this.getCurrentUser(req);
      if (!this.isSystemAdmin(currentUser.rol)) {
        await this.service.assertTransferPersonCampAccess(parsedId, currentUser.campId);
        if (body.transferId !== undefined) {
          await this.service.assertTransferCampAccess(body.transferId, currentUser.campId);
        }
      }

      const transferPerson = await this.service.updateTransferPerson(parsedId, body);
      if (!transferPerson) throw new NotFoundException('Transfer person not found');

      return {
        success: true,
        data: transferPerson,
        message: 'Transfer person updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating transfer person',
      );
    }
  }
  @Delete(':id')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Delete Transfer Person' })
  @ApiParam({ name: 'id', type: Number, description: 'Transfer Person id' })
  @ApiOkResponseMessage({ description: 'Transfer Person deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Transfer Person not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async delete() {
    throw new ForbiddenException('Transfer person records cannot be deleted for audit reasons.');
  }
}
