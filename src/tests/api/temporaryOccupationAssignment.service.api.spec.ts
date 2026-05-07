import { BadRequestException } from '@nestjs/common';
import { TemporaryOccupationAssignmentService } from '../../modules/temporaryOccupationAssignment/temporaryOccupationAssignment.service';
import { OccupationEntity } from '../../modules/occupation/occupation.entity';
import { PersonEntity } from '../../modules/person/person.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('TemporaryOccupationAssignmentService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let notificationService: any;
  let coverageService: any;
  let personRepo: any;
  let occupationRepo: any;
  let userRepo: any;
  let service: TemporaryOccupationAssignmentService;

  beforeEach(() => {
    repository = {
      findPersonById: jest.fn(),
      findOccupationById: jest.fn(),
      findActiveLinkedUserByPersonAndCamp: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllAndCount: jest.fn(),
    };
    notificationService = { notifyCampRoles: jest.fn(), notifyUser: jest.fn() };
    coverageService = { getCoverageById: jest.fn() };
    personRepo = { findOne: jest.fn(), exist: jest.fn() };
    occupationRepo = { exist: jest.fn() };
    userRepo = { exist: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === PersonEntity) return personRepo;
        if (entity === OccupationEntity) return occupationRepo;
        if (entity === UserEntity) return userRepo;
        return { findOne: jest.fn(), exist: jest.fn() };
      }),
    };

    service = new TemporaryOccupationAssignmentService(
      repository,
      dataSource as any,
      notificationService,
      coverageService,
    );
  });

  it('createAssignment throws when person not found', async () => {
    personRepo.findOne.mockResolvedValue(null);
    await expect(
      service.createAssignment({ personId: 1, temporaryOccupationId: 2, assignedBy: 3 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createAssignment throws when person unavailable', async () => {
    personRepo.findOne.mockResolvedValue({
      id: 1,
      campId: 1,
      currentStatus: 'SICK',
      occupationId: 10,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    await expect(
      service.createAssignment({ personId: 1, temporaryOccupationId: 2, assignedBy: 3 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createAssignment throws when coverage would drop below minimum', async () => {
    personRepo.findOne.mockResolvedValue({
      id: 1,
      campId: 1,
      currentStatus: 'ACTIVE',
      occupationId: 10,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    occupationRepo.exist.mockResolvedValue(true);
    userRepo.exist.mockResolvedValue(true);
    coverageService.getCoverageById.mockResolvedValue({
      availableWorkers: 1,
      minimumRequiredWorkers: 1,
      occupationName: 'Farmer',
    });

    await expect(
      service.createAssignment({ personId: 1, temporaryOccupationId: 2, assignedBy: 3 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createAssignment returns created and notifies', async () => {
    personRepo.findOne.mockResolvedValue({
      id: 1,
      campId: 1,
      currentStatus: 'ACTIVE',
      occupationId: 10,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    occupationRepo.exist.mockResolvedValue(true);
    userRepo.exist.mockResolvedValue(true);
    coverageService.getCoverageById.mockResolvedValue({
      availableWorkers: 5,
      minimumRequiredWorkers: 1,
      occupationName: 'Farmer',
    });
    repository.create.mockResolvedValue({ id: 5, personId: 1, temporaryOccupationId: 2 });
    repository.findPersonById.mockResolvedValue({
      id: 1,
      campId: 1,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    repository.findOccupationById.mockResolvedValue({ id: 2, name: 'Cook' });
    repository.findActiveLinkedUserByPersonAndCamp.mockResolvedValue({ id: 9 });

    const res = await service.createAssignment({
      personId: 1,
      temporaryOccupationId: 2,
      assignedBy: 3,
    } as any);
    expect(res).toEqual({ id: 5, personId: 1, temporaryOccupationId: 2 });
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    expect(notificationService.notifyUser).toHaveBeenCalled();
  });

  it('updateAssignment returns null when not found', async () => {
    repository.update.mockResolvedValue(null);
    await expect(service.updateAssignment(1, {} as any)).resolves.toBeNull();
  });

  it('updateAssignment returns updated and notifies', async () => {
    occupationRepo.exist.mockResolvedValue(true);
    userRepo.exist.mockResolvedValue(true);
    personRepo.exist.mockResolvedValue(true);
    personRepo.findOne.mockResolvedValue({ id: 1, campId: 1 });
    repository.update.mockResolvedValue({ id: 1, personId: 1, temporaryOccupationId: 2 });
    repository.findPersonById.mockResolvedValue({
      id: 1,
      campId: 1,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    repository.findOccupationById.mockResolvedValue({ id: 2, name: 'Cook' });
    repository.findActiveLinkedUserByPersonAndCamp.mockResolvedValue(null);

    const res = await service.updateAssignment(1, {
      personId: 1,
      temporaryOccupationId: 2,
      assignedBy: 3,
    } as any);
    expect(res).toEqual({ id: 1, personId: 1, temporaryOccupationId: 2 });
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteAssignment returns false when missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.deleteAssignment(1)).resolves.toBe(false);
  });

  it('deleteAssignment returns false when delete fails', async () => {
    repository.findById.mockResolvedValue({ id: 1, personId: 1, temporaryOccupationId: 2 });
    repository.delete.mockResolvedValue(false);
    await expect(service.deleteAssignment(1)).resolves.toBe(false);
  });

  it('deleteAssignment returns true and notifies', async () => {
    repository.findById.mockResolvedValue({ id: 1, personId: 1, temporaryOccupationId: 2 });
    repository.delete.mockResolvedValue(true);
    repository.findPersonById.mockResolvedValue({
      id: 1,
      campId: 1,
      name: 'Ana',
      lastName1: 'Lopez',
    });
    repository.findOccupationById.mockResolvedValue({ id: 2, name: 'Cook' });
    repository.findActiveLinkedUserByPersonAndCamp.mockResolvedValue({ id: 9 });

    await expect(service.deleteAssignment(1)).resolves.toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    expect(notificationService.notifyUser).toHaveBeenCalled();
  });
});
