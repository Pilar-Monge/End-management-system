import { Injectable } from '@nestjs/common';

import { TransferHistoryRepository } from './transferHistory.repository';
import type {
  CreateTransferHistoryDTO,
  TransferHistory,
  UpdateTransferHistoryDTO,
} from './transferHistory.model';
import type { TransferStatus } from '../transfer/transfer.model';

@Injectable()
export class TransferHistoryService {
  constructor(private readonly repository: TransferHistoryRepository) {}

  async createEntry(data: CreateTransferHistoryDTO): Promise<TransferHistory> {
    return await this.repository.create(data);
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
    return await this.repository.update(id, data);
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
