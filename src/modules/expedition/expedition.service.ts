import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { PersonEntity } from '../person/person.entity';
import { NotificationService } from '../notification/notification.service';
import { SystemTimeService } from '../systemTime/systemTime.service';

import { ExpeditionRepository } from './expedition.repository';
import type {
  CreateExpeditionDTO,
  Expedition,
  ExpeditionStatus,
  UpdateExpeditionDTO,
} from './expedition.model';

@Injectable()
export class ExpeditionService {
  constructor(
    private readonly repository: ExpeditionRepository,
    private readonly dataSource: DataSource,
    private readonly systemTimeService: SystemTimeService,
    private readonly notificationService: NotificationService,
  ) {}

  private async syncParticipantPersonStatuses(expeditionId: number): Promise<void> {
    const personIds = await this.repository.getActiveParticipantPersonIds(expeditionId);
    if (personIds.length === 0) {
      return;
    }

    for (const personId of personIds) {
      await this.syncPersonStatusFromExpeditions(personId);
    }
  }

  private async syncPersonStatusFromExpeditions(personId: number): Promise<void> {
    const personRepo = this.dataSource.getRepository(PersonEntity);

    const person = await personRepo.findOne({
      where: { id: personId },
      select: { id: true, currentStatus: true },
    });

    if (!person) {
      return;
    }

    const statuses = new Set(await this.repository.getTrackedExpeditionStatusesByPersonId(personId));
    let targetStatus: PersonEntity['currentStatus'] | null = null;

    if (statuses.has('LOST')) {
      targetStatus = 'OUTSIDE_CAMP';
    } else if (statuses.has('IN_PROGRESS') || statuses.has('DELAYED')) {
      targetStatus = 'ON_EXPEDITION';
    }

    if (targetStatus === null) {
      if (person.currentStatus === 'ON_EXPEDITION' || person.currentStatus === 'OUTSIDE_CAMP') {
        person.currentStatus = 'ACTIVE';
        await personRepo.save(person);
      }
      return;
    }

    if (person.currentStatus === targetStatus) {
      return;
    }

    if (!['ACTIVE', 'ON_EXPEDITION', 'OUTSIDE_CAMP'].includes(person.currentStatus)) {
      return;
    }

    person.currentStatus = targetStatus;
    await personRepo.save(person);
  }

  async createExpedition(data: CreateExpeditionDTO): Promise<Expedition> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');

    const now = this.systemTimeService.now();
    const departure = this.resolveDepartureDate(data, now);
    const estimatedDays = this.resolveEstimatedDays(data);
    const extraDays = this.resolveExtraDays(data);
    const plannedReturnDate = new Date(departure.getTime() + estimatedDays * 24 * 60 * 60 * 1000);
    const shouldStartNow = departure.getTime() <= now.getTime();

    const created = await this.repository.create({
      ...data,
      plannedDepartureDate: departure,
      actualDepartureDate: shouldStartNow ? departure : null,
      plannedReturnDate,
      extraDaysAvailable: extraDays,
      extraDaysUsed: 0,
      status: shouldStartNow ? 'IN_PROGRESS' : 'PLANNED',
    });

    await this.notificationService.notifyCampRoles(created.campId, ['SYSTEM_ADMIN', 'TRAVEL_MANAGER'], {
      type: 'EXPEDITION_CREATED',
      title: 'New expedition registered',
      message: `The expedition ${created.name} was registered with initial status ${created.status}.`,
      sourceType: 'expedition',
      sourceId: created.id,
    });

    return created;
  }

  async getExpeditionById(id: number): Promise<Expedition | null> {
    return await this.repository.findById(id);
  }

  async getAllExpeditions(filters?: {
    campId?: number;
    status?: ExpeditionStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Expedition[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      status?: ExpeditionStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async getActiveExplorations(campId?: number): Promise<Expedition[]> {
    return await this.repository.findByStatuses(['IN_PROGRESS', 'DELAYED'], campId);
  }

  async completeExploration(id: number, completedBy: number): Promise<Expedition | null> {
    const expedition = await this.repository.findById(id);
    if (!expedition) {
      return null;
    }

    if (!Number.isInteger(completedBy) || completedBy <= 0) {
      throw new Error('Invalid authenticated user');
    }

    const isParticipant = await this.repository.isUserActiveParticipant(id, completedBy);
    if (!isParticipant) {
      throw new Error('Only active expedition participants can complete this expedition');
    }

    const now = this.systemTimeService.now();
    if (now.getTime() < expedition.plannedReturnDate.getTime()) {
      throw new Error('Expedition can only be completed after the estimated return date');
    }

    if (['COMPLETED', 'CANCELED', 'LOST'].includes(expedition.status)) {
      throw new Error('Expedition cannot be completed from its current status');
    }

    await this.repository.completeExplorationWithLoot(expedition, completedBy, now);

    await this.syncParticipantPersonStatuses(id);

    const completed = await this.repository.findById(id);
    if (!completed) {
      return null;
    }

    await this.notificationService.notifyCampRoles(
      completed.campId,
      ['SYSTEM_ADMIN', 'TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT'],
      {
        type: 'EXPEDITION_COMPLETED',
        title: 'Expedition completed',
        message: `The expedition ${completed.name} was completed successfully.`,
        sourceType: 'expedition',
        sourceId: completed.id,
      },
    );

    return completed;
  }

  async updateExpedition(id: number, data: UpdateExpeditionDTO): Promise<Expedition | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }

    const normalized: UpdateExpeditionDTO = { ...data };

    if (normalized.estimatedDurationDays !== undefined) {
      if (!Number.isInteger(normalized.estimatedDurationDays) || normalized.estimatedDurationDays <= 0) {
        throw new Error('estimatedDurationDays must be an integer greater than 0');
      }

      normalized.plannedReturnDate = new Date(
        existing.plannedDepartureDate.getTime() +
          normalized.estimatedDurationDays * 24 * 60 * 60 * 1000,
      );
    }

    if (normalized.maxExtraDays !== undefined) {
      if (!Number.isInteger(normalized.maxExtraDays) || normalized.maxExtraDays < 0) {
        throw new Error('maxExtraDays must be an integer greater than or equal to 0');
      }
      normalized.extraDaysAvailable = normalized.maxExtraDays;
    }

    const updated = await this.repository.update(id, normalized);
    if (!updated) {
      return null;
    }

    if (existing.status !== updated.status) {
      await this.syncParticipantPersonStatuses(updated.id);
    }

    await this.notificationService.notifyCampRoles(
      updated.campId,
      ['SYSTEM_ADMIN', 'TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT'],
      {
        type: 'EXPEDITION_STATUS_UPDATED',
        title: 'Expedition updated',
        message: `The expedition ${updated.name} was updated in its operational plan.`,
        sourceType: 'expedition',
        sourceId: updated.id,
      },
    );

    return updated;
  }

  async deleteExpedition(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notificationService.notifyCampRoles(
      existing.campId,
      ['SYSTEM_ADMIN', 'TRAVEL_MANAGER', 'RESOURCE_MANAGEMENT'],
      {
        type: 'EXPEDITION_STATUS_UPDATED',
        title: 'Expedition deleted',
        message: `The expedition ${existing.name} was deleted from the system.`,
        sourceType: 'expedition',
        sourceId: existing.id,
      },
    );

    const personIds = await this.repository.getAllParticipantPersonIds(existing.id);
    if (personIds.length === 0) {
      return true;
    }

    const userIds = await this.repository.findUserIdsByCampAndPersonIds(existing.campId, personIds);

    if (userIds.length > 0) {
      await this.notificationService.notifyUsers(
        userIds,
        {
          campId: existing.campId,
          type: 'EXPEDITION_STATUS_UPDATED',
          title: 'Expedition canceled',
          message: `The expedition ${existing.name} you were part of was deleted.`,
          sourceType: 'expedition',
          sourceId: existing.id,
        },
      );
    }

    return true;
  }

  private resolveEstimatedDays(data: CreateExpeditionDTO): number {
    if (data.estimatedDurationDays !== undefined) {
      if (!Number.isInteger(data.estimatedDurationDays) || data.estimatedDurationDays <= 0) {
        throw new Error('estimatedDurationDays must be an integer greater than 0');
      }

      return data.estimatedDurationDays;
    }

    if (!data.plannedDepartureDate || !data.plannedReturnDate) {
      throw new Error('You must provide estimatedDurationDays or valid planned dates');
    }

    const departureMs = new Date(data.plannedDepartureDate).getTime();
    const returnMs = new Date(data.plannedReturnDate).getTime();
    const diffMs = returnMs - departureMs;
    const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

    if (!Number.isFinite(days) || days <= 0) {
      throw new Error('Could not calculate estimatedDurationDays from the provided dates');
    }

    return days;
  }

  private resolveDepartureDate(data: CreateExpeditionDTO, now: Date): Date {
    if (data.plannedDepartureDate === undefined) {
      return now;
    }

    const departure = new Date(data.plannedDepartureDate);
    if (Number.isNaN(departure.getTime())) {
      throw new Error('plannedDepartureDate must be a valid timestamp');
    }

    if (departure.getTime() < now.getTime()) {
      throw new Error('plannedDepartureDate must be current or future server time');
    }

    return departure;
  }

  private resolveExtraDays(data: CreateExpeditionDTO): number {
    const value = data.maxExtraDays ?? data.extraDaysAvailable ?? 0;

    if (!Number.isInteger(value) || value < 0) {
      throw new Error('maxExtraDays must be an integer greater than or equal to 0');
    }

    return value;
  }
}