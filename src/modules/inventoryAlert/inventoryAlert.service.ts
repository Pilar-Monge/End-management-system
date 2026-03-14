import { Injectable } from '@nestjs/common';

import { InventoryAlertRepository } from './inventoryAlert.repository';
import type {
  CreateInventoryAlertDTO,
  InventoryAlert,
  UpdateInventoryAlertDTO,
} from './inventoryAlert.model';

@Injectable()
export class InventoryAlertService {
  constructor(private readonly repository: InventoryAlertRepository) {}

  async createAlert(data: CreateInventoryAlertDTO): Promise<InventoryAlert> {
    return await this.repository.create(data);
  }

  async getAlertById(id: number): Promise<InventoryAlert | null> {
    return await this.repository.findById(id);
  }

  async getAllAlerts(filters?: {
    campId?: number;
    resourceTypeId?: number;
    resolved?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: InventoryAlert[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      resourceTypeId?: number;
      resolved?: boolean;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.resolved !== undefined) repoFilters.resolved = filters.resolved;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateAlert(id: number, data: UpdateInventoryAlertDTO): Promise<InventoryAlert | null> {
    return await this.repository.update(id, data);
  }

  async deleteAlert(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
