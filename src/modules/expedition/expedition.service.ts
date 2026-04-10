import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { SystemTimeService } from '../systemTime/systemTime.service';

import { ExpeditionRepository } from './expedition.repository';
import type {
  CreateExpeditionDTO,
  Expedition,
  ExpeditionStatus,
  UpdateExpeditionDTO,
} from './expedition.model';

@Injectable()
export class ExpeditionService {
  constructor(
    private readonly repository: ExpeditionRepository,
    private readonly dataSource: DataSource,
    private readonly systemTimeService: SystemTimeService,
  ) {}

  async createExpedition(data: CreateExpeditionDTO): Promise<Expedition> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');

    const departure = this.systemTimeService.now();
    const estimatedDays = this.resolveEstimatedDays(data);
    const extraDays = this.resolveExtraDays(data);
    const plannedReturnDate = new Date(departure.getTime() + estimatedDays * 24 * 60 * 60 * 1000);

    return await this.repository.create({
      ...data,
      plannedDepartureDate: departure,
      actualDepartureDate: null,
      plannedReturnDate,
      extraDaysAvailable: extraDays,
      extraDaysUsed: 0,
      status: 'PLANNED',
    });
  }

  async getExpeditionById(id: number): Promise<Expedition | null> {
    return await this.repository.findById(id);
  }

  async getAllExpeditions(filters?: {
    campId?: number;
    status?: ExpeditionStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Expedition[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      status?: ExpeditionStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateExpedition(id: number, data: UpdateExpeditionDTO): Promise<Expedition | null> {
    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }

    const normalized: UpdateExpeditionDTO = { ...data };

    if (normalized.duracionEstimadaDias !== undefined) {
      const expedition = await this.repository.findById(id);
      if (!expedition) {
        return null;
      }

      if (!Number.isInteger(normalized.duracionEstimadaDias) || normalized.duracionEstimadaDias <= 0) {
        throw new Error('duracionEstimadaDias debe ser un entero mayor que 0');
      }

      normalized.plannedReturnDate = new Date(
        expedition.plannedDepartureDate.getTime() +
          normalized.duracionEstimadaDias * 24 * 60 * 60 * 1000,
      );
    }

    if (normalized.diasExtrasMaximos !== undefined) {
      if (!Number.isInteger(normalized.diasExtrasMaximos) || normalized.diasExtrasMaximos < 0) {
        throw new Error('diasExtrasMaximos debe ser un entero mayor o igual a 0');
      }
      normalized.extraDaysAvailable = normalized.diasExtrasMaximos;
    }

    return await this.repository.update(id, normalized);
  }

  async deleteExpedition(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  private resolveEstimatedDays(data: CreateExpeditionDTO): number {
    if (data.duracionEstimadaDias !== undefined) {
      if (!Number.isInteger(data.duracionEstimadaDias) || data.duracionEstimadaDias <= 0) {
        throw new Error('duracionEstimadaDias debe ser un entero mayor que 0');
      }

      return data.duracionEstimadaDias;
    }

    if (!data.plannedDepartureDate || !data.plannedReturnDate) {
      throw new Error('Debe enviar duracionEstimadaDias o fechas planificadas validas');
    }

    const departureMs = new Date(data.plannedDepartureDate).getTime();
    const returnMs = new Date(data.plannedReturnDate).getTime();
    const diffMs = returnMs - departureMs;
    const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

    if (!Number.isFinite(days) || days <= 0) {
      throw new Error('No se pudo calcular duracionEstimadaDias con las fechas enviadas');
    }

    return days;
  }

  private resolveExtraDays(data: CreateExpeditionDTO): number {
    const value = data.diasExtrasMaximos ?? data.extraDaysAvailable ?? 0;

    if (!Number.isInteger(value) || value < 0) {
      throw new Error('diasExtrasMaximos debe ser un entero mayor o igual a 0');
    }

    return value;
  }
}
