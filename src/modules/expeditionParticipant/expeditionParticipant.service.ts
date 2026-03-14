import { Injectable } from '@nestjs/common';

import { ExpeditionParticipantRepository } from './expeditionParticipant.repository';
import type {
  CreateExpeditionParticipantDTO,
  ExpeditionParticipant,
  ParticipantStatus,
  UpdateExpeditionParticipantDTO,
} from './expeditionParticipant.model';

@Injectable()
export class ExpeditionParticipantService {
  constructor(private readonly repository: ExpeditionParticipantRepository) {}

  async createParticipant(data: CreateExpeditionParticipantDTO): Promise<ExpeditionParticipant> {
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
    return await this.repository.update(id, data);
  }

  async deleteParticipant(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
