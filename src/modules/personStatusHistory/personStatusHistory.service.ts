import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { NotificationService } from '../notification/notification.service';
import { PersonStatusHistoryRepository } from './personStatusHistory.repository';
import type {
  CreatePersonStatusHistoryDTO,
  PersonStatus,
  PersonStatusHistory,
  UpdatePersonStatusHistoryDTO,
} from './personStatusHistory.model';

@Injectable()
export class PersonStatusHistoryService {
  constructor(
    private readonly repository: PersonStatusHistoryRepository,
    private readonly notificationService: NotificationService,
  ) {}

  private async validateAdminFromSameCamp(personId: number, changedBy: number): Promise<void> {
    const person = await this.repository.findPersonById(personId);
    if (!person) {
      throw new NotFoundException('Persona no encontrada');
    }

    const user = await this.repository.findUserById(changedBy);
    if (!user) {
      throw new NotFoundException('No se encontro el usuario que cambio el estado');
    }

    if (user.role !== 'SYSTEM_ADMIN') {
      throw new ForbiddenException(
        'Solo usuarios SYSTEM_ADMIN pueden cambiar el estado de la persona',
      );
    }

    if (user.campId !== person.campId) {
      throw new BadRequestException('El campamento del usuario no coincide con el de la persona');
    }
  }

  async createEntry(data: CreatePersonStatusHistoryDTO): Promise<PersonStatusHistory> {
    const created = await this.repository.createEntryTransactional(data).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : '';

      if (message === 'PERSON_NOT_FOUND') {
        throw new NotFoundException('Persona no encontrada');
      }

      if (message === 'CHANGED_BY_NOT_FOUND') {
        throw new NotFoundException('No se encontro el usuario que cambio el estado');
      }

      if (message === 'ONLY_SYSTEM_ADMIN') {
        throw new ForbiddenException(
          'Solo usuarios SYSTEM_ADMIN pueden cambiar el estado de la persona',
        );
      }

      if (message === 'CAMP_MISMATCH') {
        throw new BadRequestException('El campamento del usuario no coincide con el de la persona');
      }

      if (message === 'PREVIOUS_STATUS_MISMATCH') {
        throw new BadRequestException(
          'previousStatus no coincide con el estado actual de la persona',
        );
      }

      throw error;
    });

    await this.notifyStatusChange(data.personId, data.previousStatus, data.newStatus);
    return created;
  }

  async getEntryById(id: number): Promise<PersonStatusHistory | null> {
    return await this.repository.findById(id);
  }

  async getAllEntries(filters?: {
    personId?: number;
    changedBy?: number;
    previousStatus?: PersonStatus;
    newStatus?: PersonStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: PersonStatusHistory[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      personId?: number;
      changedBy?: number;
      previousStatus?: PersonStatus;
      newStatus?: PersonStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.changedBy !== undefined) repoFilters.changedBy = filters.changedBy;
    if (filters?.previousStatus !== undefined) repoFilters.previousStatus = filters.previousStatus;
    if (filters?.newStatus !== undefined) repoFilters.newStatus = filters.newStatus;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateEntry(
    id: number,
    data: UpdatePersonStatusHistoryDTO,
  ): Promise<PersonStatusHistory | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const personIdToValidate = data.personId ?? existing.personId;
    const changedByToValidate = data.changedBy ?? existing.changedBy;
    await this.validateAdminFromSameCamp(personIdToValidate, changedByToValidate);

    const updated = await this.repository.update(id, data);
    if (updated && updated.personId && updated.previousStatus && updated.newStatus) {
      await this.notifyStatusChange(updated.personId, updated.previousStatus, updated.newStatus);
    }

    return updated;
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  private async notifyStatusChange(
    personId: number,
    previousStatus: PersonStatus,
    newStatus: PersonStatus,
  ): Promise<void> {
    const person = await this.repository.findPersonCampInfo(personId);

    if (!person) {
      return;
    }

    const message = `El estado de la persona ${personId} cambio de ${previousStatus} a ${newStatus}.`;

    await this.notificationService.notifyCampRoles(
      person.campId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'PERSON_STATUS_CHANGED',
        title: 'Cambio de estado de persona',
        message,
        sourceType: 'person_status_history',
        sourceId: personId,
      },
    );

    const associatedUser = await this.repository.findAssociatedUserByPersonAndCamp(
      personId,
      person.campId,
    );

    if (!associatedUser) {
      return;
    }

    await this.notificationService.notifyUser(associatedUser.id, {
      campId: person.campId,
      type: 'PERSON_STATUS_CHANGED',
      title: 'Cambio de estado personal',
      message: `Tu estado fue actualizado de ${previousStatus} a ${newStatus}.`,
      sourceType: 'person_status_history',
      sourceId: personId,
    });
  }
}
