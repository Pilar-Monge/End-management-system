import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { NotificationService } from '../notification/notification.service';
import { UserEntity } from '../systemUser/systemUser.entity';
import { CampRepository } from './camp.repository';
import type { Camp, CampStatus, CreateCampDTO, UpdateCampDTO } from './camp.model';

@Injectable()
export class CampService {
  constructor(
    private readonly repository: CampRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private async notifyGlobalAdmins(title: string, message: string, sourceId: number): Promise<void> {
    const userRepo = this.dataSource.getRepository(UserEntity);
    const admins = await userRepo.find({
      where: {
        role: 'SYSTEM_ADMIN',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        campId: true,
      },
    });

    for (const admin of admins) {
      await this.notificationService.notifyUser(admin.id, {
        campId: admin.campId,
        type: 'USER_STATUS_UPDATED',
        title,
        message,
        sourceType: 'camp',
        sourceId,
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

    await this.notifyGlobalAdmins(
      'Campamento actualizado',
      `Se actualizo el campamento ${updated.name} (ID: ${updated.id}).`,
      updated.id,
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
      );
    }

    return deleted;
  }
}
