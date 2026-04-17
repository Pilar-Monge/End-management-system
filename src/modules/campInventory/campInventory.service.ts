import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { NotificationService } from '../notification/notification.service';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { CampInventoryRepository } from './campInventory.repository';
import type {
  CampInventory,
  CreateCampInventoryDTO,
  UpdateCampInventoryDTO,
} from './campInventory.model';

@Injectable()
export class CampInventoryService {
  constructor(
    private readonly repository: CampInventoryRepository,
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  async createItem(data: CreateCampInventoryDTO): Promise<CampInventory> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );

    const existing = await this.repository.findByKey(data.campId, data.resourceTypeId);
    if (existing) {
      throw new Error('Este elemento de inventario del campamento ya existe');
    }

    const created = await this.repository.create(data);
    await this.notificationService.notifyCampRoles(created.campId, ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'], {
      type: 'INVENTORY_ALERT',
      title: 'Elemento de inventario creado',
      message: `Se agrego el recurso ${created.resourceTypeId} al inventario del campamento.`,
      sourceType: 'camp_inventory',
      sourceId: created.resourceTypeId,
    });
    return created;
  }

  async getItem(campId: number, resourceTypeId: number): Promise<CampInventory | null> {
    return await this.repository.findByKey(campId, resourceTypeId);
  }

  async getAllItems(filters?: {
    campId?: number;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CampInventory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateItem(
    campId: number,
    resourceTypeId: number,
    data: UpdateCampInventoryDTO,
  ): Promise<CampInventory | null> {
    const updated = await this.repository.update(campId, resourceTypeId, data);
    if (!updated) {
      return null;
    }

    await this.notificationService.notifyCampRoles(updated.campId, ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'], {
      type: 'INVENTORY_ALERT',
      title: 'Elemento de inventario actualizado',
      message: `Se actualizo el recurso ${updated.resourceTypeId} en el inventario del campamento.`,
      sourceType: 'camp_inventory',
      sourceId: updated.resourceTypeId,
    });

    return updated;
  }

  async deleteItem(campId: number, resourceTypeId: number): Promise<boolean> {
    const existing = await this.repository.findByKey(campId, resourceTypeId);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(campId, resourceTypeId);
    if (!deleted) {
      return false;
    }

    await this.notificationService.notifyCampRoles(campId, ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'], {
      type: 'INVENTORY_ALERT',
      title: 'Elemento de inventario eliminado',
      message: `Se elimino el recurso ${resourceTypeId} del inventario del campamento.`,
      sourceType: 'camp_inventory',
      sourceId: resourceTypeId,
    });

    return true;
  }
}
