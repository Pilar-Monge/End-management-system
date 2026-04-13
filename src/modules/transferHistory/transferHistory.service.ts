import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { NotificationService } from '../notification/notification.service';
import type { NotificationType } from '../notification/notification.model';
import { TransferEntity } from '../transfer/transfer.entity';
import { UserEntity } from '../systemUser/systemUser.entity';

import { TransferHistoryRepository } from './transferHistory.repository';
import type {
  CreateTransferHistoryDTO,
  TransferHistory,
  UpdateTransferHistoryDTO,
} from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';

@Injectable()
export class TransferHistoryService {
  constructor(
    private readonly repository: TransferHistoryRepository,
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

  private getNotificationTypeFromStatus(newStatus: TransferStatus): NotificationType {
    if (newStatus === 'COMPLETED') {
      return 'TRANSFER_COMPLETED';
    }

    if (newStatus === 'CANCELED') {
      return 'TRANSFER_CANCELED';
    }

    return 'TRANSFER_PENDING';
  }

  private async notifyTransferHistoryChange(entry: TransferHistory): Promise<void> {
    const scope = await this.resolveTransferScope(entry.transferId);
    const title = 'Historial de traslado actualizado';
    const message = `Traslado ${entry.transferId}: ${entry.previousStatus} -> ${entry.newStatus}.`;
    const notificationType = this.getNotificationTypeFromStatus(entry.newStatus);

    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: notificationType,
        title,
        message,
        sourceType: 'transfer_history',
        sourceId: entry.id,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: notificationType,
        title,
        message,
        sourceType: 'transfer_history',
        sourceId: entry.id,
      },
    );
  }

  async createEntry(data: CreateTransferHistoryDTO): Promise<TransferHistory> {
    await assertEntityExists(this.dataSource, TransferEntity, data.transferId, 'Transfer');
    await assertEntityExists(this.dataSource, UserEntity, data.userId, 'User');
    const created = await this.repository.create(data);
    await this.notifyTransferHistoryChange(created);
    return created;
  }

  async getEntryById(id: number): Promise<TransferHistory | null> {
    return await this.repository.findById(id);
  }

  async getAllEntries(filters?: {
    transferId?: number;
    userId?: number;
    previousStatus?: TransferStatus;
    newStatus?: TransferStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: TransferHistory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      transferId?: number;
      userId?: number;
      previousStatus?: TransferStatus;
      newStatus?: TransferStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.transferId !== undefined) repoFilters.transferId = filters.transferId;
    if (filters?.userId !== undefined) repoFilters.userId = filters.userId;
    if (filters?.previousStatus !== undefined) repoFilters.previousStatus = filters.previousStatus;
    if (filters?.newStatus !== undefined) repoFilters.newStatus = filters.newStatus;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateEntry(id: number, data: UpdateTransferHistoryDTO): Promise<TransferHistory | null> {
    if (data.transferId !== undefined) {
      await assertEntityExists(this.dataSource, TransferEntity, data.transferId, 'Transfer');
    }
    if (data.userId !== undefined) {
      await assertEntityExists(this.dataSource, UserEntity, data.userId, 'User');
    }

    const updated = await this.repository.update(id, data);
    if (updated) {
      await this.notifyTransferHistoryChange(updated);
    }

    return updated;
  }

  async deleteEntry(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notifyTransferHistoryChange(existing);
    return true;
  }
}
