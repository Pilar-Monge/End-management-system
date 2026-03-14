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

import { PersonService } from './person.service';
import type {
  CreatePersonDTO,
  PersonStatus,
  UpdatePersonDTO,
} from './person.model';

@Controller('persons')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post()
  async create(@Body() body: CreatePersonDTO) {
    try {
      const person = await this.service.createPerson(body);
      return {
        success: true,
        data: person,
        message: 'Person created successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating person',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    const person = await this.service.getPersonById(parsedId);
    if (!person) throw new NotFoundException('Person not found');

    return { success: true, data: person };
  }

  @Get()
  async getAll(
    @Query('campamentoId') campamentoId?: string,
    @Query('campId') campId?: string,
    @Query('estado') estado?: PersonStatus,
    @Query('status') status?: PersonStatus,
    @Query('currentStatus') currentStatus?: PersonStatus,
    @Query('occupationId') occupationId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const filters: {
        campId?: number;
        currentStatus?: PersonStatus;
        occupationId?: number;
        page?: number;
        limit?: number;
      } = {};

      const resolvedCampId = campId ?? campamentoId;
      if (resolvedCampId) {
        const parsedCampId = Number.parseInt(resolvedCampId, 10);
        if (Number.isNaN(parsedCampId)) {
          throw new BadRequestException('Invalid camp ID');
        }
        filters.campId = parsedCampId;
      }

      const resolvedStatus = currentStatus ?? status ?? estado;
      if (resolvedStatus) {
        filters.currentStatus = resolvedStatus;
      }

      if (occupationId) {
        const parsedOccupationId = Number.parseInt(occupationId, 10);
        if (Number.isNaN(parsedOccupationId)) {
          throw new BadRequestException('Invalid occupation ID');
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

      const result = await this.service.getAllPersons(filters);
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
        error instanceof Error ? error.message : 'Error getting persons',
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePersonDTO) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const person = await this.service.updatePerson(parsedId, body);
      if (!person) throw new NotFoundException('Person not found');

      return {
        success: true,
        data: person,
        message: 'Person updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error updating person',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Invalid ID');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('Invalid ID');

    try {
      const deleted = await this.service.deletePerson(parsedId);
      if (!deleted) throw new NotFoundException('Person not found');

      return { success: true, message: 'Person deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error deleting person',
      );
    }
  }
}
