import { Injectable } from '@nestjs/common';

import { DeliveredTransferResourceRepository } from './deliveredTransferResource.repository';
import type {
  CreateDeliveredTransferResourceDTO,
  DeliveredTransferResource,
  UpdateDeliveredTransferResourceDTO,
} from './deliveredTransferResource.model';

@Injectable()
export class DeliveredTransferResourceService {
  constructor(private readonly repository: DeliveredTransferResourceRepository) {}

  async createDeliveredResource(
    data: CreateDeliveredTransferResourceDTO,
  ): Promise<DeliveredTransferResource> {
    const existing = await this.repository.findByTransferAndResourceType(
      data.transferId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This delivered transfer resource already exists');
    }

    return await this.repository.create(data);
  }

  async getDeliveredResourceById(id: number): Promise<DeliveredTransferResource | null> {
    return await this.repository.findById(id);
  }

  async getAllDeliveredResources(filters?: {
    transferId?: number;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: DeliveredTransferResource[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      transferId?: number;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.transferId !== undefined) repoFilters.transferId = filters.transferId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateDeliveredResource(
    id: number,
    data: UpdateDeliveredTransferResourceDTO,
  ): Promise<DeliveredTransferResource | null> {
    return await this.repository.update(id, data);
  }

  async deleteDeliveredResource(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
