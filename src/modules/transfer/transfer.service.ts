import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { NotificationService } from '../notification/notification.service';

import { TransferRepository } from './transfer.repository';
import type {
  CreateTransferDTO,
  Transfer,
  TransferStatus,
  UpdateTransferDTO,
} from './transfer.model';

@Injectable()
export class TransferService {
  constructor(
    private readonly repository: TransferRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
    createdBy: number;
    respondedBy: number | null;
  }> {
    const requestRepo = this.dataSource.getRepository(IntercampRequestEntity);
    const request = await requestRepo.findOne({
      where: { id: requestId },
      select: {
        originCampId: true,
        destinationCampId: true,
        createdBy: true,
        respondedBy: true,
      },
    });

    if (!request) {
      throw new Error('Intercamp request not found');
    }

    return {
      originCampId: request.originCampId,
      destinationCampId: request.destinationCampId,
      createdBy: request.createdBy,
      respondedBy: request.respondedBy,
    };
  }

  async createTransfer(data: CreateTransferDTO): Promise<Transfer> {
    await assertEntityExists(
      this.dataSource,
      IntercampRequestEntity,
      data.requestId,
      'Intercamp request',
    );

    const existing = await this.repository.findByRequestId(data.requestId);
    if (existing) {
      throw new Error('A transfer already exists for this request');
    }

    const created = await this.repository.create(data);
    const scope = await this.resolveRequestScope(data.requestId);

    const message = `Se creo el traslado #${created.id} con estado ${created.status}.`;
    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_PENDING',
        title: 'Nuevo traslado intercampamento',
        message,
        sourceType: 'transfer',
        sourceId: created.id,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_PENDING',
        title: 'Nuevo traslado intercampamento',
        message,
        sourceType: 'transfer',
        sourceId: created.id,
      },
    );

    return created;
  }

  async getTransferById(id: number): Promise<Transfer | null> {
    return await this.repository.findById(id);
  }

  async getAllTransfers(filters?: {
    requestId?: number;
    status?: TransferStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Transfer[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      status?: TransferStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateTransfer(id: number, data: UpdateTransferDTO): Promise<Transfer | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    if (data.requestId !== undefined && data.requestId !== existing.requestId) {
      await assertEntityExists(
        this.dataSource,
        IntercampRequestEntity,
        data.requestId,
        'Intercamp request',
      );

      const byRequest = await this.repository.findByRequestId(data.requestId);
      if (byRequest && byRequest.id !== id) {
        throw new Error('A transfer already exists for this request');
      }
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    if (updated.status !== existing.status) {
      const scope = await this.resolveRequestScope(updated.requestId);
      const notificationType =
        updated.status === 'COMPLETED'
          ? 'TRANSFER_COMPLETED'
          : updated.status === 'CANCELED'
            ? 'TRANSFER_CANCELED'
            : 'TRANSFER_PENDING';

      const title =
        updated.status === 'COMPLETED'
          ? 'Traslado completado'
          : updated.status === 'CANCELED'
            ? 'Traslado cancelado'
            : 'Traslado pendiente de salida';

      const message = `El traslado #${updated.id} cambio su estado a ${updated.status}.`;

      await this.notificationService.notifyCampRoles(
        scope.originCampId,
        ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
        {
          type: notificationType,
          title,
          message,
          sourceType: 'transfer',
          sourceId: updated.id,
        },
      );
      await this.notificationService.notifyCampRoles(
        scope.destinationCampId,
        ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
        {
          type: notificationType,
          title,
          message,
          sourceType: 'transfer',
          sourceId: updated.id,
        },
      );
    }

    return updated;
  }

  async deleteTransfer(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const scope = await this.resolveRequestScope(existing.requestId);
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    const title = 'Traslado eliminado';
    const message = `El traslado #${id} fue eliminado del sistema.`;
    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_CANCELED',
        title,
        message,
        sourceType: 'transfer',
        sourceId: id,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_CANCELED',
        title,
        message,
        sourceType: 'transfer',
        sourceId: id,
      },
    );

    return true;
  }
}
