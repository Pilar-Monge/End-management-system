import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { PersonEntity } from '../person/person.entity';
import { NotificationService } from '../notification/notification.service';
import { UserEntity } from '../systemUser/systemUser.entity';
import { ExpeditionParticipantRepository } from './expeditionParticipant.repository';
import type {
  CreateExpeditionParticipantDTO,
  ExpeditionParticipant,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';

@Injectable()
export class ExpeditionParticipantService {
  constructor(
    private readonly repository: ExpeditionParticipantRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
    @InjectRepository(ExpeditionEntity)
    private readonly expeditionRepo: Repository<ExpeditionEntity>,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
  ) {}

  async assertExpeditionCampAccess(expeditionId: number, currentCampId: number): Promise<void> {
    const campId = await this.repository.findExpeditionCampId(expeditionId);
    if (campId === null) {
      throw new NotFoundException('Expedition not found');
    }

    if (campId !== currentCampId) {
      throw new BadRequestException('You can only access expedition participants from your camp');
    }
  }

  async assertParticipantCampAccess(id: number, currentCampId: number): Promise<void> {
    const campId = await this.repository.findParticipantCampId(id);
    if (campId === null) {
      throw new NotFoundException('Expedition participant not found');
    }

    if (campId !== currentCampId) {
      throw new BadRequestException('You can only access expedition participants from your camp');
    }
  }

  private isStatusManagedByExpeditions(status: PersonEntity['currentStatus']): boolean {
    return ['ACTIVE', 'ON_EXPEDITION', 'OUTSIDE_CAMP'].includes(status);
  }

  private async syncPersonStatusWithExpeditions(personId: number): Promise<void> {
    const person = await this.personRepo.findOne({
      where: { id: personId },
      select: { id: true, currentStatus: true },
    });

    if (!person) {
      return;
    }

    const hasLostExpedition = await this.repository.hasActiveParticipationInExpeditionStatuses(
      personId,
      ['LOST'],
    );
    const hasOngoingExpedition = await this.repository.hasActiveParticipationInExpeditionStatuses(
      personId,
      ['IN_PROGRESS', 'DELAYED'],
    );

    let targetStatus: PersonEntity['currentStatus'] | null = null;
    if (hasLostExpedition) {
      targetStatus = 'OUTSIDE_CAMP';
    } else if (hasOngoingExpedition) {
      targetStatus = 'ON_EXPEDITION';
    }

    if (targetStatus === null) {
      if (person.currentStatus === 'ON_EXPEDITION' || person.currentStatus === 'OUTSIDE_CAMP') {
        person.currentStatus = 'ACTIVE';
        await this.personRepo.save(person);
      }
      return;
    }

    if (person.currentStatus === targetStatus) {
      return;
    }

    if (!this.isStatusManagedByExpeditions(person.currentStatus)) {
      return;
    }

    person.currentStatus = targetStatus;
    await this.personRepo.save(person);
  }

  private validateCreateParticipantPreconditions(expeditionId: number, personId: number): void {
    if (!Number.isInteger(expeditionId) || expeditionId <= 0) {
      throw new BadRequestException('expeditionId must be a positive integer');
    }

    if (!Number.isInteger(personId) || personId <= 0) {
      throw new BadRequestException('personId must be a positive integer');
    }
  }

  private async validateParticipantCamp(
    expeditionId: number,
    personId: number,
  ): Promise<{ expedition: ExpeditionEntity; person: PersonEntity }> {
    const expedition = await this.expeditionRepo.findOne({ where: { id: expeditionId } });
    if (!expedition) {
      throw new NotFoundException('Expedition not found');
    }

    if (expedition.status !== 'PLANNED') {
      throw new BadRequestException('Only planned expeditions can receive new participants');
    }

    const person = await this.personRepo.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.currentStatus === 'INACTIVE') {
      throw new BadRequestException('Inactive people cannot be assigned to expeditions');
    }

    if (person.campId !== expedition.campId) {
      throw new BadRequestException('Person does not belong to the same camp as the expedition');
    }

    return { expedition, person };
  }

  async createParticipant(data: CreateExpeditionParticipantDTO): Promise<ExpeditionParticipant> {
    this.validateCreateParticipantPreconditions(data.expeditionId, data.personId);

    const { expedition } = await this.validateParticipantCamp(data.expeditionId, data.personId);

    const existing = await this.repository.findByExpeditionAndPerson(
      data.expeditionId,
      data.personId,
    );
    if (existing) {
      throw new BadRequestException('This expedition participant already exists');
    }

    const participant = await this.repository.create(data);

    if (participant.status !== 'ACTIVE') {
      return participant;
    }

    if (expedition.status !== 'PLANNED') {
      return participant;
    }

    const userRepo = this.dataSource.getRepository(UserEntity);
    const assignedUser = await userRepo.findOne({
      select: { id: true, campId: true },
      where: { personId: data.personId },
    });

    if (assignedUser && assignedUser.campId === expedition.campId) {
      await this.notificationService.notifyUser(assignedUser.id, {
        campId: expedition.campId,
        type: 'EXPEDITION_RETURN',
        title: 'Expedition assignment',
        message: `You have been assigned to a new expedition: ${expedition.name}. Check the details in your dashboard.`,
        sourceType: 'expedition',
        sourceId: expedition.id,
      });
    }

    await this.syncPersonStatusWithExpeditions(participant.personId);

    return participant;
  }

  async getParticipantById(id: number): Promise<ExpeditionParticipant | null> {
    return await this.repository.findById(id);
  }

  async getAllParticipants(filters?: {
    expeditionId?: number;
    personId?: number;
    status?: ParticipantStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: ExpeditionParticipant[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      expeditionId?: number;
      personId?: number;
      status?: ParticipantStatus;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.expeditionId !== undefined) repoFilters.expeditionId = filters.expeditionId;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateParticipant(
    id: number,
    data: UpdateExpeditionParticipantDTO,
  ): Promise<ExpeditionParticipant | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const expeditionId = data.expeditionId ?? existing.expeditionId;
    const personId = data.personId ?? existing.personId;

    const { expedition } = await this.validateParticipantCamp(expeditionId, personId);

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    const userRepo = this.dataSource.getRepository(UserEntity);
    const linkedUser = await userRepo.findOne({
      where: {
        personId: updated.personId,
        campId: expedition.campId,
      },
      select: {
        id: true,
      },
    });

    if (linkedUser) {
      await this.notificationService.notifyUser(linkedUser.id, {
        campId: expedition.campId,
        type: 'EXPEDITION_STATUS_UPDATED',
        title: 'Expedition participation updated',
        message: `Your participation in expedition ${expedition.name} was updated.`,
        sourceType: 'expedition_participant',
        sourceId: updated.id,
      });
    }

    if (existing.personId !== updated.personId) {
      await this.syncPersonStatusWithExpeditions(existing.personId);
    }
    await this.syncPersonStatusWithExpeditions(updated.personId);

    return updated;
  }

  async deleteParticipant(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    const expedition = await this.expeditionRepo.findOne({
      where: {
        id: existing.expeditionId,
      },
      select: {
        id: true,
        campId: true,
        name: true,
      },
    });

    if (!expedition) {
      return true;
    }

    const userRepo = this.dataSource.getRepository(UserEntity);
    const linkedUser = await userRepo.findOne({
      where: {
        personId: existing.personId,
        campId: expedition.campId,
      },
      select: {
        id: true,
      },
    });

    if (linkedUser) {
      await this.notificationService.notifyUser(linkedUser.id, {
        campId: expedition.campId,
        type: 'EXPEDITION_STATUS_UPDATED',
        title: 'Expedition participation removed',
        message: `You were removed from expedition ${expedition.name}.`,
        sourceType: 'expedition',
        sourceId: expedition.id,
      });
    }

    await this.syncPersonStatusWithExpeditions(existing.personId);

    return true;
  }
}
