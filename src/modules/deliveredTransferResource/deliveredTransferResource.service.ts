import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationService } from '../notification/notification.service';
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
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private async resolveTransferScope(transferId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  }> {
    const rows = await this.dataSource.query(
      `SELECT r.origin_camp_id, r.destination_camp_id
       FROM public.transfer t
       JOIN public.intercamp_request r ON r.id = t.request_id
       WHERE t.id = $1
       LIMIT 1`,
      [transferId],
    );

    const row = rows[0] as { origin_camp_id: number; destination_camp_id: number } | undefined;
    if (!row) {
      throw new Error('Transfer scope not found');
    }

    return {
      originCampId: row.origin_camp_id,
      destinationCampId: row.destination_camp_id,
    };
  }

  private async notifyDeliveredResourceChange(
    transferId: number,
    detailId: number,
    resourceTypeId: number,
    actionLabel: string,
  ): Promise<void> {
    const scope = await this.resolveTransferScope(transferId);
    const title = 'Registro de recursos entregados';
    const message = `${actionLabel} para recurso ${resourceTypeId} en traslado ${transferId}.`;

    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_RESOURCE_RECORDED',
        title,
        message,
        sourceType: 'delivered_transfer_resource',
        sourceId: detailId,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_RESOURCE_RECORDED',
        title,
        message,
        sourceType: 'delivered_transfer_resource',
        sourceId: detailId,
      },
    );
  }

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

    const created = await this.repository.create(data);
    await this.notifyDeliveredResourceChange(
      created.transferId,
      created.id,
      created.resourceTypeId,
      'Se registro entrega de recurso',
    );
    return created;
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

    const updated = await this.repository.update(id, data);
    if (updated) {
      await this.notifyDeliveredResourceChange(
        updated.transferId,
        updated.id,
        updated.resourceTypeId,
        'Se actualizo entrega de recurso',
      );
    }

    return updated;
  }

  async deleteDeliveredResource(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
