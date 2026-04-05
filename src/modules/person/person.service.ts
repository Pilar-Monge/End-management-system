import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { CampEntity } from '../camp/camp.entity';
import { OccupationEntity } from '../occupation/occupation.entity';
import { assertEntityExists } from '../../common/validation/assert-exists';
import { PersonRepository } from './person.repository';
import type { CreatePersonDTO, Person, PersonStatus, UpdatePersonDTO } from './person.model';
import { PersonStatusHistoryRepository } from '../personStatusHistory/personStatusHistory.repository';

@Injectable()
export class PersonService {
  constructor(
    private readonly repository: PersonRepository,
    private readonly personStatusHistoryRepository: PersonStatusHistoryRepository,
    private readonly dataSource: DataSource,
    @InjectRepository(AdmissionRequestEntity)
    private readonly admissionRequestRepository: Repository<AdmissionRequestEntity>,
  ) {}

  private async assertAdmissionRequestExists(admissionRequestId: number): Promise<void> {
    const admissionRequest = await this.admissionRequestRepository.findOne({
      where: { id: admissionRequestId },
      select: { id: true },
    });
    if (!admissionRequest) {
      throw new Error('Admission request not found');
    }
  }

  async createPerson(data: CreatePersonDTO): Promise<Person> {
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    if (data.occupationId !== undefined && data.occupationId !== null) {
      await assertEntityExists(this.dataSource, OccupationEntity, data.occupationId, 'Occupation');
    }
    const existingByIdentification = await this.repository.findByIdentificationNumber(data.identificationNumber);
    if (existingByIdentification) {
      throw new Error('A person with this identification number already exists');
    }
    const admissionRequestId = data.admissionRequestId ?? null;
    if (admissionRequestId !== null) {
      await this.assertAdmissionRequestExists(admissionRequestId);
      const existingByRequest = await this.repository.findByAdmissionRequestId(admissionRequestId);
      if (existingByRequest) {
        throw new Error('A person for this admission request already exists');
      }
    }
    return await this.repository.create(data);
  }

  async getPersonById(id: number): Promise<Person | null> {
    return await this.repository.findById(id);
  }

  async getAllPersons(filters?: {
    campId?: number;
    currentStatus?: PersonStatus;
    occupationId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Person[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;
    const repoFilters: {
      campId?: number;
      currentStatus?: PersonStatus;
      occupationId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };
    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.currentStatus !== undefined) repoFilters.currentStatus = filters.currentStatus;
    if (filters?.occupationId !== undefined) repoFilters.occupationId = filters.occupationId;
    return await this.repository.findAllAndCount(repoFilters);
  }

  async updatePerson(id: number, data: UpdatePersonDTO): Promise<Person | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;
    if (data.campId !== undefined) {
      await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
    }
    if (data.occupationId !== undefined && data.occupationId !== null) {
      await assertEntityExists(this.dataSource, OccupationEntity, data.occupationId, 'Occupation');
    }
    if (data.identificationNumber && data.identificationNumber !== existing.identificationNumber) {
      const byIdentification = await this.repository.findByIdentificationNumber(data.identificationNumber);
      if (byIdentification && byIdentification.id !== id) {
        throw new Error('Another person with this identification number already exists');
      }
    }
    if (data.admissionRequestId !== undefined && data.admissionRequestId !== existing.admissionRequestId && data.admissionRequestId !== null) {
      await this.assertAdmissionRequestExists(data.admissionRequestId);
      const byRequest = await this.repository.findByAdmissionRequestId(data.admissionRequestId);
      if (byRequest && byRequest.id !== id) {
        throw new Error('Another person for this admission request already exists');
      }
    }
    const updated = await this.repository.update(id, data);
    if (data.currentStatus !== undefined && data.currentStatus !== existing.currentStatus) {
      await this.personStatusHistoryRepository.create({
        personId: id,
        previousStatus: existing.currentStatus,
        newStatus: data.currentStatus,
        changedBy: 0,
        reason: null,
      });
    }
    return updated;
  }

  async deletePerson(id: number): Promise<boolean> {
    return false;
  }
}