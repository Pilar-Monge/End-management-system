import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { PersonEntity } from '../person/person.entity';
import { TransferEntity } from '../transfer/transfer.entity';

import { TransferPersonRepository } from './transferPerson.repository';
import type {
  CreateTransferPersonDTO,
  PersonTransferStatus,
  TransferPerson,
  UpdateTransferPersonDTO,
} from './transferPerson.model';

@Injectable()
export class TransferPersonService {
  constructor(
    private readonly repository: TransferPersonRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createTransferPerson(data: CreateTransferPersonDTO): Promise<TransferPerson> {
    await assertEntityExists(this.dataSource, TransferEntity, data.transferId, 'Transfer');
    await assertEntityExists(this.dataSource, PersonEntity, data.personId, 'Person');

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
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const resolvedTransferId = data.transferId ?? existing.transferId;
    const resolvedPersonId = data.personId ?? existing.personId;

    if (data.transferId !== undefined) {
      await assertEntityExists(this.dataSource, TransferEntity, resolvedTransferId, 'Transfer');
    }
    if (data.personId !== undefined) {
      await assertEntityExists(this.dataSource, PersonEntity, resolvedPersonId, 'Person');
    }

    if (resolvedTransferId !== existing.transferId || resolvedPersonId !== existing.personId) {
      const byPair = await this.repository.findByTransferAndPerson(
        resolvedTransferId,
        resolvedPersonId,
      );
      if (byPair && byPair.id !== id) {
        throw new Error('This person is already assigned to this transfer');
      }
    }

    return await this.repository.update(id, data);
  }

  async deleteTransferPerson(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
