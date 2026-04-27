import { QueryFailedError } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { PersonService } from './person.service';
import type { CreatePersonDTO, Person } from './person.model';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('PersonService', () => {
  const mockedAssertEntityExists = assertEntityExists as jest.MockedFunction<typeof assertEntityExists>;

  const repository = {
    admissionRequestExists: jest.fn(),
    findByIdentificationNumber: jest.fn(),
    findByAdmissionRequestId: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findLinkedUserByPersonAndCamp: jest.fn(),
  };

  const personStatusHistoryRepository = {
    create: jest.fn(),
  };

  const notificationService = {
    notifyCampRoles: jest.fn(),
    notifyUser: jest.fn(),
  };

  let service: PersonService;

  const createDto: CreatePersonDTO = {
    admissionRequestId: 11,
    name: 'Jane',
    lastName1: 'Doe',
    identificationNumber: 'ID-100',
    birthDate: new Date('2000-01-01T00:00:00.000Z'),
    gender: 'FEMALE',
    campId: 2,
    occupationId: 5,
  };

  const basePerson: Person = {
    id: 1,
    admissionRequestId: 11,
    name: 'Jane',
    lastName1: 'Doe',
    lastName2: null,
    identificationNumber: 'ID-100',
    birthDate: new Date('2000-01-01T00:00:00.000Z'),
    gender: 'FEMALE',
    initialHealthLevel: null,
    previousExperience: null,
    physicalConditionAtEntry: null,
    currentStatus: 'ACTIVE',
    imageUrl: null,
    campId: 2,
    occupationId: 5,
    entryDate: new Date('2026-01-01T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PersonService(
      repository as never,
      personStatusHistoryRepository as never,
      notificationService as never,
      {} as never,
    );
  });

  it('creates person successfully', async () => {
    repository.findByIdentificationNumber.mockResolvedValue(null);
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByAdmissionRequestId.mockResolvedValue(null);
    repository.create.mockResolvedValue(basePerson);

    await expect(service.createPerson(createDto)).resolves.toEqual(basePerson);
    expect(mockedAssertEntityExists).toHaveBeenCalledTimes(2);
  });

  it('throws when identification number already exists', async () => {
    repository.findByIdentificationNumber.mockResolvedValue(basePerson);

    await expect(service.createPerson(createDto)).rejects.toThrow(
      'A person with this identification number already exists',
    );
  });

  it('throws when admission request does not exist', async () => {
    repository.findByIdentificationNumber.mockResolvedValue(null);
    repository.admissionRequestExists.mockResolvedValue(false);

    await expect(service.createPerson(createDto)).rejects.toThrow('Admission request not found');
  });

  it('throws when a person already exists for same admission request', async () => {
    repository.findByIdentificationNumber.mockResolvedValue(null);
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByAdmissionRequestId.mockResolvedValue(basePerson);

    await expect(service.createPerson(createDto)).rejects.toThrow(
      'A person for this admission request already exists',
    );
  });

  it('maps unique constraint error for admission request in createPerson', async () => {
    repository.findByIdentificationNumber.mockResolvedValue(null);
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByAdmissionRequestId.mockResolvedValue(null);
    repository.create.mockRejectedValue(
      new QueryFailedError('INSERT', [], { code: '23505', constraint: 'uq_person_request' }),
    );

    await expect(service.createPerson(createDto)).rejects.toThrow(
      'Ya existe una persona asociada a esta solicitud de admision',
    );
  });

  it('returns null when update target does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.updatePerson(9, { name: 'Other' })).resolves.toBeNull();
  });

  it('throws when changing identification to one used by another person', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.findByIdentificationNumber.mockResolvedValue({ ...basePerson, id: 77 });

    await expect(service.updatePerson(1, { identificationNumber: 'ID-200' })).rejects.toThrow(
      'Another person with this identification number already exists',
    );
  });

  it('updates person and emits status change notifications', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.update.mockResolvedValue({ ...basePerson, currentStatus: 'INJURED' });
    repository.findLinkedUserByPersonAndCamp.mockResolvedValue({ id: 500 });

    const updated = await service.updatePerson(1, { currentStatus: 'INJURED' });

    expect(updated?.currentStatus).toBe('INJURED');
    expect(personStatusHistoryRepository.create).toHaveBeenCalledWith({
      personId: 1,
      previousStatus: 'ACTIVE',
      newStatus: 'INJURED',
      changedBy: 0,
      reason: null,
    });
    expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(1);
    expect(notificationService.notifyUser).toHaveBeenCalledWith(500, {
      campId: 2,
      type: 'PERSON_STATUS_CHANGED',
      title: 'Cambio de estado personal',
      message: 'Tu estado fue actualizado de ACTIVE a INJURED.',
      sourceType: 'person',
      sourceId: 1,
    });
  });

  it('updates person without status notifications when status does not change', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.update.mockResolvedValue(basePerson);

    await service.updatePerson(1, { name: 'Janet' });

    expect(personStatusHistoryRepository.create).not.toHaveBeenCalled();
    expect(notificationService.notifyCampRoles).not.toHaveBeenCalled();
    expect(notificationService.notifyUser).not.toHaveBeenCalled();
  });

  it('returns false in deletePerson when target does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.deletePerson(44)).resolves.toBe(false);
  });

  it('returns false in deletePerson when repository delete fails', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.delete.mockResolvedValue(false);

    await expect(service.deletePerson(1)).resolves.toBe(false);
  });

  it('deletes person and notifies camp roles and linked user', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.delete.mockResolvedValue(true);
    repository.findLinkedUserByPersonAndCamp.mockResolvedValue({ id: 808 });

    await expect(service.deletePerson(1)).resolves.toBe(true);

    expect(notificationService.notifyCampRoles).toHaveBeenCalledWith(
      2,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'PERSON_STATUS_CHANGED',
        title: 'Persona eliminada',
        message: 'La persona 1 fue eliminada del sistema.',
        sourceType: 'person',
        sourceId: 1,
      },
    );
    expect(notificationService.notifyUser).toHaveBeenCalledWith(808, {
      campId: 2,
      type: 'PERSON_STATUS_CHANGED',
      title: 'Registro personal eliminado',
      message: 'Tu registro personal fue eliminado del sistema.',
      sourceType: 'person',
      sourceId: 1,
      sendEmail: false,
    });
  });

  it('deletes person without user notification when no linked user exists', async () => {
    repository.findById.mockResolvedValue(basePerson);
    repository.delete.mockResolvedValue(true);
    repository.findLinkedUserByPersonAndCamp.mockResolvedValue(null);

    await expect(service.deletePerson(1)).resolves.toBe(true);

    expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(1);
    expect(notificationService.notifyUser).not.toHaveBeenCalled();
  });
});