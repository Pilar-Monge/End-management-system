import { Injectable } from '@nestjs/common';

import { NotificationService } from '../notification/notification.service';
import { CampRepository } from './camp.repository';
import type { Camp, CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';

@Injectable()
export class CampService {
  constructor(
    private readonly repository: CampRepository,
    private readonly notificationService: NotificationService,
  ) {}

  private valueToText(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  private async notifyGlobalAdmins(
    title: string,
    message: string,
    sourceId: number,
    emailPayload?: Record<string, unknown>,
  ): Promise<void> {
    const admins = await this.repository.findActiveSystemAdmins();

    for (const admin of admins) {
      const notificationOptions: {
        campId: number;
        type: 'USER_STATUS_UPDATED';
        title: string;
        message: string;
        sourceType: 'camp';
        sourceId: number;
        email?: {
          payload: Record<string, unknown>;
        };
      } = {
        campId: admin.campId,
        type: 'USER_STATUS_UPDATED',
        title,
        message,
        sourceType: 'camp',
        sourceId,
      };

      if (emailPayload) {
        notificationOptions.email = {
          payload: emailPayload,
        };
      }

      await this.notificationService.notifyUser(admin.id, {
        ...notificationOptions,
      });
    }
  }

  async createCamp(data: CreateCampDTO): Promise<Camp> {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error('A camp with this name already exists');
    }

    const created = await this.repository.create(data);
    await this.notifyGlobalAdmins(
      'Campamento creado',
      `Se creo el campamento ${created.name} (ID: ${created.id}).`,
      created.id,
      {
        changedFields: [
          { field: 'Nombre', previous: '-', current: this.valueToText(created.name) },
          {
            field: 'Capacidad maxima',
            previous: '-',
            current: this.valueToText(created.maxPersonCapacity),
          },
          {
            field: 'Racion minima diaria',
            previous: '-',
            current: this.valueToText(created.minimumDailyRationPerPerson),
          },
          {
            field: 'Umbral alerta inventario',
            previous: '-',
            current: this.valueToText(created.stockAlertThresholdPercentage),
          },
        ],
      },
    );

    return created;
  }

  async getCampById(id: number): Promise<Camp | null> {
    return await this.repository.findById(id);
  }

  async getAllCamps(filters?: {
    status?: CampStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Camp[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      status?: CampStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateCamp(id: number, data: UpdateCampDTO): Promise<Camp | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.name && data.name !== existing.name) {
      const byName = await this.repository.findByName(data.name);
      if (byName && byName.id !== id) {
        throw new Error('Another camp with this name already exists');
      }
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    const labels: Record<string, string> = {
      name: 'Nombre',
      latitude: 'Latitud',
      longitude: 'Longitud',
      description: 'Descripcion',
      status: 'Estado',
      foundationDate: 'Fecha fundacion',
      maxPersonCapacity: 'Capacidad maxima',
      sessionInactivityMinutes: 'Minutos inactividad',
      minimumDailyRationPerPerson: 'Racion minima diaria',
      stockAlertThresholdPercentage: 'Umbral alerta inventario',
    };

    const changedFields = Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => {
        const before = this.valueToText((existing as unknown as Record<string, unknown>)[key]);
        const current = this.valueToText((updated as unknown as Record<string, unknown>)[key]);
        return {
          field: labels[key] ?? key,
          previous: before,
          current,
        };
      });

    await this.notifyGlobalAdmins(
      'Campamento actualizado',
      `Se actualizo el campamento ${updated.name} (ID: ${updated.id}) con ${changedFields.length} cambio(s).`,
      updated.id,
      {
        changedFields,
      },
    );

    return updated;
  }

  async deleteCamp(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (deleted) {
      await this.notifyGlobalAdmins(
        'Campamento eliminado',
        `Se elimino el campamento ${existing.name} (ID: ${existing.id}).`,
        existing.id,
        {
          changedFields: [
            { field: 'Nombre', previous: this.valueToText(existing.name), current: 'Eliminado' },
            {
              field: 'Estado',
              previous: this.valueToText(existing.status),
              current: 'Eliminado',
            },
          ],
        },
      );
    }

    return deleted;
  }
}
