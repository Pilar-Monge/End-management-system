import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { InventoryMovementService } from '../inventoryMovement/inventoryMovement.service';
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
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly dataSource: DataSource,
  ) {}

  private roundToTwo(value: number): string {
    return (Math.round(value * 100) / 100).toFixed(2);
  }

  private getTripDurationDays(plannedDepartureDate: Date, plannedArrivalDate: Date): number {
    const millisPerDay = 24 * 60 * 60 * 1000;
    const rawDays = (plannedArrivalDate.getTime() - plannedDepartureDate.getTime()) / millisPerDay;
    const roundedDays = Math.ceil(rawDays);
    return Math.max(1, Number.isFinite(roundedDays) ? roundedDays : 1);
  }

  async syncTransferRations(transferId: number): Promise<Transfer | null> {
    const transfer = await this.repository.findById(transferId);
    if (!transfer) {
      return null;
    }

    const scope = await this.resolveRequestScope(transfer.requestId);
    const camp = await this.dataSource.getRepository(CampEntity).findOne({
      where: { id: scope.originCampId },
      select: { id: true, minimumDailyRationPerPerson: true },
    });

    if (!camp) {
      throw new Error('Campamento de origen no encontrado para calcular raciones');
    }

    const plannedDepartureDate = transfer.plannedDepartureDate;
    const plannedArrivalDate = transfer.plannedArrivalDate;
    if (!plannedDepartureDate || !plannedArrivalDate) {
      const updated = await this.repository.update(transferId, { rationsForTrip: '0.00' });
      return updated;
    }

    const peopleCount = await this.repository.countTransferPeople(transferId);
    if (peopleCount === 0) {
      const updated = await this.repository.update(transferId, { rationsForTrip: '0.00' });
      return updated;
    }

    const rationPerPerson = Number.parseFloat(camp.minimumDailyRationPerPerson);
    if (!Number.isFinite(rationPerPerson) || rationPerPerson <= 0) {
      throw new Error('La racion minima diaria del campamento es invalida');
    }

    const durationDays = this.getTripDurationDays(plannedDepartureDate, plannedArrivalDate);
    const totalRations = this.roundToTwo(peopleCount * rationPerPerson * durationDays);

    return await this.repository.update(transferId, { rationsForTrip: totalRations });
  }

  private async countAppliedTransferMovements(transferId: number): Promise<number> {
    return await this.repository.countAppliedTransferMovements(transferId);
  }

  private async applyCompletedTransferInventory(
    transferId: number,
    requestId: number,
    actorUserId: number,
  ): Promise<void> {
    const alreadyApplied = await this.countAppliedTransferMovements(transferId);
    if (alreadyApplied > 0) {
      return;
    }

    const scope = await this.resolveRequestScope(requestId);
    const deliveredRows = await this.repository.findDeliveredResourcesByTransferId(transferId);

    for (const delivered of deliveredRows) {
      await this.inventoryMovementService.createMovement({
        campId: scope.originCampId,
        resourceTypeId: delivered.resourceTypeId,
        amount: delivered.sentAmount,
        movementType: 'TRANSFER_SENT',
        sourceId: transferId,
        sourceType: 'transfer',
        recordedBy: actorUserId,
        description: `Auto transfer sent movement for transfer #${transferId} (detail #${delivered.id})`,
      });

      await this.inventoryMovementService.createMovement({
        campId: scope.destinationCampId,
        resourceTypeId: delivered.resourceTypeId,
        amount: delivered.receivedAmount,
        movementType: 'TRANSFER_RECEIVED',
        sourceId: transferId,
        sourceType: 'transfer',
        recordedBy: actorUserId,
        description: `Auto transfer received movement for transfer #${transferId} (detail #${delivered.id})`,
      });
    }
  }

  private async createTransferHistoryEntry(
    transferId: number,
    previousStatus: TransferStatus,
    newStatus: TransferStatus,
    userId: number,
  ): Promise<void> {
    await this.repository.createTransferHistoryEntry({
      transferId,
      previousStatus,
      newStatus,
      userId,
      comment: `Auto history on transfer status change: ${previousStatus} -> ${newStatus}`,
    });
  }

  private async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
    createdBy: number;
    respondedBy: number | null;
  }> {
    const scope = await this.repository.resolveRequestScope(requestId);
    if (!scope) {
      throw new Error('Solicitud intercampamento no encontrada');
    }

    return scope;
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
      throw new Error('Ya existe un traslado para esta solicitud');
    }

    const created = await this.repository.create(data);
    await this.syncTransferRations(created.id);
    const scope = await this.resolveRequestScope(data.requestId);

    const message = `El traslado #${created.id} fue creado con estado ${created.status}.`;
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

  async getTransferByRequestId(requestId: number): Promise<Transfer | null> {
    return await this.repository.findByRequestId(requestId);
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

    if (data.status === 'COMPLETED') {
      const resolvedDepartureApprovedBy = data.departureApprovedBy ?? existing.departureApprovedBy;
      const resolvedArrivalApprovedBy = data.arrivalApprovedBy ?? existing.arrivalApprovedBy;

      if (resolvedDepartureApprovedBy === null || resolvedArrivalApprovedBy === null) {
        throw new Error(
          'Para completar el traslado se requieren aprobaciones de salida y llegada',
        );
      }
    }

    if (data.requestId !== undefined && data.requestId !== existing.requestId) {
      await assertEntityExists(
        this.dataSource,
        IntercampRequestEntity,
        data.requestId,
        'Intercamp request',
      );

      const byRequest = await this.repository.findByRequestId(data.requestId);
      if (byRequest && byRequest.id !== id) {
        throw new Error('Ya existe un traslado para esta solicitud');
      }
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    if (updated.status !== existing.status) {
      const scope = await this.resolveRequestScope(updated.requestId);
      const actorUserId =
        updated.arrivalApprovedBy ??
        updated.departureApprovedBy ??
        data.arrivalApprovedBy ??
        data.departureApprovedBy ??
        scope.respondedBy ??
        scope.createdBy;

      if (updated.status === 'COMPLETED') {
        await this.applyCompletedTransferInventory(updated.id, updated.requestId, actorUserId);
      }

      await this.createTransferHistoryEntry(
        updated.id,
        existing.status,
        updated.status,
        actorUserId,
      );

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

    await this.syncTransferRations(updated.id);

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
