import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampEntity } from '../camp/camp.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { IntercampRequestRepository } from './intercampRequest.repository';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

@Injectable()
export class IntercampRequestService {
  constructor(
    private readonly repository: IntercampRequestRepository,
    @InjectRepository(CampEntity)
    private readonly campRepo: Repository<CampEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private async validateRoutingAndOwnership(
    originCampId: number,
    destinationCampId: number,
    createdBy: number,
    respondedBy?: number | null,
  ): Promise<void> {
    if (originCampId === destinationCampId) {
      throw new BadRequestException('Origin and destination camps must be different');
    }

    const originCamp = await this.campRepo.findOne({ where: { id: originCampId } });
    if (!originCamp) {
      throw new NotFoundException('Origin camp not found');
    }

    const destinationCamp = await this.campRepo.findOne({ where: { id: destinationCampId } });
    if (!destinationCamp) {
      throw new NotFoundException('Destination camp not found');
    }

    const creatorUser = await this.userRepo.findOne({ where: { id: createdBy } });
    if (!creatorUser) {
      throw new NotFoundException('CreatedBy user not found');
    }

    if (creatorUser.campId !== originCampId) {
      throw new BadRequestException('CreatedBy user does not belong to origin camp');
    }

    if (respondedBy === null || respondedBy === undefined) {
      return;
    }

    const responderUser = await this.userRepo.findOne({ where: { id: respondedBy } });
    if (!responderUser) {
      throw new NotFoundException('RespondedBy user not found');
    }

    if (responderUser.campId !== destinationCampId) {
      throw new BadRequestException('RespondedBy user does not belong to destination camp');
    }
  }

  async createRequest(data: CreateIntercampRequestDTO): Promise<IntercampRequest> {
    await this.validateRoutingAndOwnership(
      data.originCampId,
      data.destinationCampId,
      data.createdBy,
      data.respondedBy,
    );

    return await this.repository.create(data);
  }

  async getRequestById(id: number): Promise<IntercampRequest | null> {
    return await this.repository.findById(id);
  }

  async getAllRequests(filters?: {
    originCampId?: number;
    destinationCampId?: number;
    status?: IntercampRequestStatus;
    createdBy?: number;
    respondedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: IntercampRequest[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      originCampId?: number;
      destinationCampId?: number;
      status?: IntercampRequestStatus;
      createdBy?: number;
      respondedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.originCampId !== undefined) repoFilters.originCampId = filters.originCampId;
    if (filters?.destinationCampId !== undefined)
      repoFilters.destinationCampId = filters.destinationCampId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;
    if (filters?.createdBy !== undefined) repoFilters.createdBy = filters.createdBy;
    if (filters?.respondedBy !== undefined) repoFilters.respondedBy = filters.respondedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRequest(id: number, data: UpdateIntercampRequestDTO): Promise<IntercampRequest | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const originCampId = data.originCampId ?? existing.originCampId;
    const destinationCampId = data.destinationCampId ?? existing.destinationCampId;
    const createdBy = data.createdBy ?? existing.createdBy;
    const respondedBy = data.respondedBy !== undefined ? data.respondedBy : existing.respondedBy;

    await this.validateRoutingAndOwnership(originCampId, destinationCampId, createdBy, respondedBy);

    return await this.repository.update(id, data);
  }

  async deleteRequest(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
