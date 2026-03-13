import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  type AdmissionRequest,
  type CreateAdmissionRequestDTO,
  type UpdateAdmissionRequestDTO,
  type AdmissionRequestStatus
} from './admissionRequest.model';
import { AdmissionRequestEntity } from './admissionRequest.entity';

@Injectable()
export class AdmissionRequestRepository {
  constructor(
    @InjectRepository(AdmissionRequestEntity)
    private readonly repo: Repository<AdmissionRequestEntity>,
  ) {}

  async create(data: CreateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const entity = this.repo.create({
      ...data,
      lastName2: data.lastName2 ?? null,
      photoUrl: data.photoUrl ?? null,
      declaredHealthLevel: data.declaredHealthLevel ?? null,
      previousExperience: data.previousExperience ?? null,
      physicalCondition: data.physicalCondition ?? null,
      declaredSkills: data.declaredSkills ?? null,
      status: 'PENDING_AI',
      suggestedOccupationId: null,
      finalOccupationId: null,
      occupationModified: false,
      reviewedBy: null,
      reviewDate: null,
      rejectionReason: null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<AdmissionRequest | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAll(filters?: {
    campId?: number;
    status?: AdmissionRequestStatus;
    offset?: number;
    limit?: number;
  }): Promise<AdmissionRequest[]> {
    const qb = this.repo.createQueryBuilder('req');

    if (filters?.campId) {
      qb.andWhere('req.campId = :campId', {
        campId: filters.campId,
      });
    }

    if (filters?.status) {
      qb.andWhere('req.status = :status', { status: filters.status });
    }

    qb.orderBy('req.createdAt', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    return await qb.getMany();
  }

  async update(id: number, data: UpdateAdmissionRequestDTO): Promise<AdmissionRequest | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<AdmissionRequestEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async countByCampAndStatus(campId: number, status: AdmissionRequestStatus): Promise<number> {
    return await this.repo.count({ where: { campId, status } });
  }

  async findByEmail(email: string): Promise<AdmissionRequest | null> {
    return await this.repo.findOne({ where: { email } });
  }
}