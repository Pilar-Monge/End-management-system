import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { NotificationService } from '../notification/notification.service';
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

  private async notifyTransferPersonEvent(
    transferId: number,
    personId: number,
    status: PersonTransferStatus,
    sourceId: number,
  ): Promise<void> {
    const scope = await this.resolveTransferScope(transferId);
    const title = 'Actualizacion de persona en traslado';
    const message = `La persona ${personId} en el traslado ${transferId} cambio al estado ${status}.`;

    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_PERSON_UPDATED',
        title,
        message,
        sourceType: 'transfer_person',
        sourceId,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'TRANSFER_PERSON_UPDATED',
        title,
        message,
        sourceType: 'transfer_person',
        sourceId,
      },
    );

    const linkedUser = await this.repository.findLinkedUserByPersonId(personId);

    if (!linkedUser) {
      return;
    }

    await this.notificationService.notifyUser(linkedUser.id, {
      campId: linkedUser.campId,
      type: 'TRANSFER_PERSON_UPDATED',
      title: 'Estado de traslado actualizado',
      message: `Tu traslado fue actualizado al estado ${status}.`,
      sourceType: 'transfer_person',
      sourceId,
    });
  }

  async createTransferPerson(data: CreateTransferPersonDTO): Promise<TransferPerson> {
    await assertEntityExists(this.dataSource, TransferEntity, data.transferId, 'Transfer');
    await assertEntityExists(this.dataSource, PersonEntity, data.personId, 'Person');

    const existing = await this.repository.findByTransferAndPerson(data.transferId, data.personId);
    if (existing) {
      throw new Error('Esta persona ya esta asignada a este traslado');
    }

    const created = await this.repository.create(data);
    await this.notifyTransferPersonEvent(
      created.transferId,
      created.personId,
      created.status,
      created.id,
    );
    return created;
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
        throw new Error('Esta persona ya esta asignada a este traslado');
      }
    }

    const updated = await this.repository.update(id, data);
    if (updated && updated.status !== existing.status) {
      await this.notifyTransferPersonEvent(
        updated.transferId,
        updated.personId,
        updated.status,
        updated.id,
      );
    }

    return updated;
  }

  async deleteTransferPerson(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notifyTransferPersonEvent(
      existing.transferId,
      existing.personId,
      existing.status,
      existing.id,
    );

    return true;
  }
}
