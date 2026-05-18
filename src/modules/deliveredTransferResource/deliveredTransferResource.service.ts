import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    const scope = await this.repository.resolveTransferScope(transferId);
    if (!scope) {
      throw new Error('No se encontro el alcance del traslado');
    }

    return scope;
  }

  async assertTransferCampAccess(transferId: number, currentCampId: number): Promise<void> {
    const scope = await this.repository.resolveTransferScope(transferId);
    if (!scope) {
      throw new NotFoundException('Transfer not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException('You can only access delivered resources involving your camp');
    }
  }

  async assertDeliveredCampAccess(deliveredId: number, currentCampId: number): Promise<void> {
    const scope = await this.repository.resolveDeliveredScope(deliveredId);
    if (!scope) {
      throw new NotFoundException('Delivered transfer resource not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException('You can only access delivered resources involving your camp');
    }
  }

  private async notifyDeliveredResourceChange(
    transferId: number,
    detailId: number,
    resourceTypeId: number,
    actionLabel: string,
  ): Promise<void> {
    const scope = await this.resolveTransferScope(transferId);
    const title = 'Registro de recursos entregados';
    const message = `${actionLabel} para el recurso ${resourceTypeId} en el traslado ${transferId}.`;

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
      throw new Error('Este recurso entregado del traslado ya existe');
    }

    const created = await this.repository.create(data);
    await this.notifyDeliveredResourceChange(
      created.transferId,
      created.id,
      created.resourceTypeId,
      'Se registro la entrega del recurso',
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
        throw new Error('Este recurso entregado del traslado ya existe');
      }
    }

    const updated = await this.repository.update(id, data);
    if (updated) {
      await this.notifyDeliveredResourceChange(
        updated.transferId,
        updated.id,
        updated.resourceTypeId,
        'Se actualizo la entrega del recurso',
      );
    }

    return updated;
  }

  async deleteDeliveredResource(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notifyDeliveredResourceChange(
      existing.transferId,
      existing.id,
      existing.resourceTypeId,
      'Se elimino el registro de entrega del recurso',
    );

    return true;
  }
}
