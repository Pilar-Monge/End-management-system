import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { NotificationService } from '../notification/notification.service';
import { PersonEntity } from '../person/person.entity';
import { TransferEntity } from '../transfer/transfer.entity';
import { TransferService } from '../transfer/transfer.service';

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
    private readonly transferService: TransferService,
    private readonly dataSource: DataSource,
  ) {}

  private validateRequirementPayload(
    requirements: Array<{ occupationId: number; quantity: number }>,
  ): void {
    for (const requirement of requirements) {
      if (!Number.isInteger(requirement.occupationId) || requirement.occupationId <= 0) {
        throw new Error('occupationId must be a positive integer');
      }

      if (!Number.isInteger(requirement.quantity) || requirement.quantity <= 0) {
        throw new Error('quantity must be a positive integer');
      }
    }
  }

  async canFulfillRequirements(
    originCampId: number,
    requirements: Array<{ occupationId: number; quantity: number }>,
  ): Promise<void> {
    if (requirements.length === 0) {
      return;
    }

    this.validateRequirementPayload(requirements);

    const selectedPersonIds = new Set<number>();

    for (const requirement of requirements) {
      const eligiblePersonIds = await this.repository.findEligiblePersonIdsByCampAndOccupation(
        originCampId,
        requirement.occupationId,
      );

      const availablePersonIds = eligiblePersonIds.filter(
        (personId) => !selectedPersonIds.has(personId),
      );
      if (availablePersonIds.length < requirement.quantity) {
        throw new Error(
          `No hay suficientes personas elegibles para el oficio ${requirement.occupationId}`,
        );
      }

      for (const personId of availablePersonIds.slice(0, requirement.quantity)) {
        selectedPersonIds.add(personId);
      }
    }
  }

  async autoAssignGroupForTransfer(
    transferId: number,
    originCampId: number,
    requirements: Array<{ occupationId: number; quantity: number }>,
  ): Promise<TransferPerson[]> {
    if (requirements.length === 0) {
      return [];
    }

    this.validateRequirementPayload(requirements);
    const selectedPersonIds = new Set<number>();
    const createdAssignments: TransferPerson[] = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const requirement of requirements) {
        const eligiblePersonIds =
          await this.repository.findEligiblePersonIdsByCampAndOccupationForUpdate(
            queryRunner,
            originCampId,
            requirement.occupationId,
          );

        const availablePersonIds = eligiblePersonIds.filter(
          (personId) => !selectedPersonIds.has(personId),
        );
        if (availablePersonIds.length < requirement.quantity) {
          throw new Error(
            `No hay suficientes personas elegibles para el oficio ${requirement.occupationId}`,
          );
        }

        for (const personId of availablePersonIds.slice(0, requirement.quantity)) {
          selectedPersonIds.add(personId);

          const created = await this.repository.insertTransferPersonWithQueryRunner(
            queryRunner,
            transferId,
            personId,
            'CONFIRMED',
          );

          if (created) {
            createdAssignments.push(created);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.transferService.syncTransferRations(transferId);
    return createdAssignments;
  }

  async assignTransportStaffForTransfer(
    transferId: number,
    supplierCampId: number,
    personIds: number[],
  ): Promise<TransferPerson[]> {
    const uniquePersonIds = [...new Set(personIds)];
    if (uniquePersonIds.length === 0) {
      throw new Error('Debe asignar al menos una persona operativa al traslado');
    }

    const people = await this.repository.findPeopleByIds(uniquePersonIds);
    if (people.length !== uniquePersonIds.length) {
      throw new Error('Una o mas personas operativas no existen');
    }

    const invalidPerson = people.find(
      (person) => person.campId !== supplierCampId || person.currentStatus !== 'ACTIVE',
    );
    if (invalidPerson) {
      throw new Error('Las personas operativas deben estar activas en el campamento proveedor');
    }

    const busyPersonIds = await this.repository.findActiveTransferAssignmentsByPersonIds(
      uniquePersonIds,
      transferId,
    );
    if (busyPersonIds.length > 0) {
      throw new Error('Una o mas personas operativas ya estan asignadas a otro traslado activo');
    }

    const createdAssignments: TransferPerson[] = [];

    for (const personId of uniquePersonIds) {
      const existing = await this.repository.findByTransferAndPerson(transferId, personId);
      if (existing) {
        createdAssignments.push(existing);
        continue;
      }

      const created = await this.createTransferPerson({
        transferId,
        personId,
        status: 'CONFIRMED',
      });
      createdAssignments.push(created);
    }

    await this.transferService.syncTransferRations(transferId);
    return createdAssignments;
  }

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
    await this.transferService.syncTransferRations(created.transferId);
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

    if (updated) {
      await this.transferService.syncTransferRations(updated.transferId);
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

    await this.transferService.syncTransferRations(existing.transferId);

    return true;
  }

  async assertTransferCampAccess(transferId: number, currentCampId: number): Promise<void> {
    const scope = await this.repository.resolveTransferScope(transferId);
    if (!scope) {
      throw new Error('No se encontro el alcance del traslado');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException('You can only access transfer persons involving your camp');
    }
  }

  async assertTransferPersonCampAccess(
    transferPersonId: number,
    currentCampId: number,
  ): Promise<void> {
    const scope = await this.repository.resolveTransferPersonScope(transferPersonId);
    if (!scope) {
      throw new NotFoundException('Transfer person not found');
    }

    if (scope.originCampId !== currentCampId && scope.destinationCampId !== currentCampId) {
      throw new BadRequestException('You can only access transfer persons involving your camp');
    }
  }
}
