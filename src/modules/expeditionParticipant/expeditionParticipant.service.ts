import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { PersonEntity } from '../person/person.entity';
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
    @InjectRepository(ExpeditionEntity)
    private readonly expeditionRepo: Repository<ExpeditionEntity>,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
  ) {}

  private async validateParticipantCamp(expeditionId: number, personId: number): Promise<void> {
    const expedition = await this.expeditionRepo.findOne({ where: { id: expeditionId } });
    if (!expedition) {
      throw new NotFoundException('Expedition not found');
    }

    const person = await this.personRepo.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.campId !== expedition.campId) {
      throw new BadRequestException('Person does not belong to the same camp as the expedition');
    }
  }

  async createParticipant(data: CreateExpeditionParticipantDTO): Promise<ExpeditionParticipant> {
    await this.validateParticipantCamp(data.expeditionId, data.personId);

    const existing = await this.repository.findByExpeditionAndPerson(
      data.expeditionId,
      data.personId,
    );
    if (existing) {
      throw new Error('This expedition participant already exists');
    }

    return await this.repository.create(data);
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

    await this.validateParticipantCamp(expeditionId, personId);

    return await this.repository.update(id, data);
  }

  async deleteParticipant(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
