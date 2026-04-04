import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { TransferEntity } from '../transfer/transfer.entity';

import { DeliveredTransferResourceRepository } from './deliveredTransferResource.repository';
import type {
  CreateDeliveredTransferResourceDTO,
  DeliveredTransferResource,
  UpdateDeliveredTransferResourceDTO,
} from './deliveredTransferResource.model';

@Injectable()
export class DeliveredTransferResourceService {
  constructor(
    private readonly repository: DeliveredTransferResourceRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createDeliveredResource(
    data: CreateDeliveredTransferResourceDTO,
  ): Promise<DeliveredTransferResource> {
    await assertEntityExists(this.dataSource, TransferEntity, data.transferId, 'Transfer');
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );
    if (data.movementId !== undefined && data.movementId !== null) {
      await assertEntityExists(
        this.dataSource,
        InventoryMovementEntity,
        data.movementId,
        'Inventory movement',
      );
    }

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
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const resolvedTransferId = data.transferId ?? existing.transferId;
    const resolvedResourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;

    if (data.transferId !== undefined) {
      await assertEntityExists(this.dataSource, TransferEntity, resolvedTransferId, 'Transfer');
    }
    if (data.resourceTypeId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        ResourceTypeEntity,
        resolvedResourceTypeId,
        'Resource type',
      );
    }
    if (data.movementId !== undefined && data.movementId !== null) {
      await assertEntityExists(
        this.dataSource,
        InventoryMovementEntity,
        data.movementId,
        'Inventory movement',
      );
    }

    if (
      resolvedTransferId !== existing.transferId ||
      resolvedResourceTypeId !== existing.resourceTypeId
    ) {
      const byPair = await this.repository.findByTransferAndResourceType(
        resolvedTransferId,
        resolvedResourceTypeId,
      );
      if (byPair && byPair.id !== id) {
        throw new Error('This delivered transfer resource already exists');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteDeliveredResource(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
