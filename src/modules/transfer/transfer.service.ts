import { Injectable } from '@nestjs/common';

import { TransferRepository } from './transfer.repository';
import type {
  CreateTransferDTO,
  Transfer,
  TransferStatus,
  UpdateTransferDTO,
} from './transfer.model';

@Injectable()
export class TransferService {
  constructor(private readonly repository: TransferRepository) {}

  async createTransfer(data: CreateTransferDTO): Promise<Transfer> {
    const existing = await this.repository.findByRequestId(data.requestId);
    if (existing) {
      throw new Error('A transfer already exists for this request');
    }

    return await this.repository.create(data);
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
    return await this.repository.update(id, data);
  }

  async deleteTransfer(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
