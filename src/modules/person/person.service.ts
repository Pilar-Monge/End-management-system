import { Injectable } from '@nestjs/common';

import { PersonRepository } from './person.repository';
import type { CreatePersonDTO, Person, PersonStatus, UpdatePersonDTO } from './person.model';
import { PersonStatusHistoryRepository } from '../personStatusHistory/personStatusHistory.repository';

@Injectable()
export class PersonService {
  constructor(
    private readonly repository: PersonRepository,
    private readonly personStatusHistoryRepository: PersonStatusHistoryRepository,
  ) {}

  async createPerson(data: CreatePersonDTO): Promise<Person> {
    const existingByIdentification = await this.repository.findByIdentificationNumber(
      data.identificationNumber,
    );

    if (existingByIdentification) {
      throw new Error('A person with this identification number already exists');
    }

    const admissionRequestId = data.admissionRequestId ?? null;
    if (admissionRequestId !== null) {
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
