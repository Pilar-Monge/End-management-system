import { Injectable } from '@nestjs/common';

import { TransferPersonRepository } from './transferPerson.repository';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  TransferPerson,
  UpdateTransferPersonDTO,
} from './transferPerson.model';

@Injectable()
export class TransferPersonService {
  constructor(private readonly repository: TransferPersonRepository) {}

  async createTransferPerson(data: CreateTransferPersonDTO): Promise<TransferPerson> {
    const existing = await this.repository.findByTransferAndPerson(data.transferId, data.personId);
    if (existing) {
      throw new Error('This person is already assigned to this transfer');
    }

    return await this.repository.create(data);
  }

  async getTransferPersonById(id: number): Promise<TransferPerson | null> {
    return await this.repository.findById(id);
  }

  async getAllTransferPeople(filters?: {
    transferId?: number;
    personId?: number;
    status?: PersonTransferStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: TransferPerson[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      transferId?: number;
      personId?: number;
      status?: PersonTransferStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.transferId !== undefined) repoFilters.transferId = filters.transferId;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateTransferPerson(
    id: number,
    data: UpdateTransferPersonDTO,
  ): Promise<TransferPerson | null> {
    return await this.repository.update(id, data);
  }

  async deleteTransferPerson(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
