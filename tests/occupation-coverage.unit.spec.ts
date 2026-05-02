import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TemporaryOccupationAssignmentService } from '../src/modules/temporaryOccupationAssignment/temporaryOccupationAssignment.service';
import { OccupationCoverageService } from '../src/modules/occupationCoverage/occupationCoverage.service';
import { PersonEntity } from '../src/modules/person/person.entity';
import { OccupationEntity } from '../src/modules/occupation/occupation.entity';
import { UserEntity } from '../src/modules/systemUser/systemUser.entity';
import type { OccupationCoverage } from '../src/modules/occupationCoverage/occupationCoverage.model';

describe('Occupation Coverage Unit Tests', () => {
  const coverageRepository = {
    getOccupationCoverageByCamp: jest.fn(),
    getOccupationCoverageById: jest.fn(),
    getCriticalOccupationsByCamp: jest.fn(),
    getAvailablePersonsForReplacement: jest.fn(),
  };

  const assignmentRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findPersonById: jest.fn(),
    findOccupationById: jest.fn(),
    findActiveLinkedUserByPersonAndCamp: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const personRepo = {
    findOne: jest.fn(),
    exist: jest.fn(),
  };

  const genericRepo = {
    exist: jest.fn(),
  };

  const dataSource = {
    getRepository: jest.fn((entity) => {
      if (entity === PersonEntity) {
        return personRepo;
      }

      return genericRepo;
    }),
  } as unknown as DataSource;

  const notificationService = {
    notifyCampRoles: jest.fn(),
    notifyUser: jest.fn(),
  };

  const coverageService = new OccupationCoverageService(
    coverageRepository as never,
  );

  const assignmentService = new TemporaryOccupationAssignmentService(
    assignmentRepository as never,
    dataSource,
    notificationService as never,
    coverageService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates coverage metrics by occupation', async () => {
    const mockCoverage: OccupationCoverage = {
      occupationId: 1,
      occupationName: 'Doctor',
      minimumRequiredWorkers: 2,
      preferredWorkers: 3,
      criticalThresholdPercent: '50.00',
      availableWorkers: 1,
      activeWorkers: 1,
      coveragePercent: 50,
      isCritical: false,
      isAtRisk: true,
      deficit: 1,
      surplus: 0,
      campId: 1,
    };

    jest.mocked(coverageRepository.getOccupationCoverageById).mockResolvedValue(mockCoverage);

    const result = await coverageService.getCoverageById(1, 1);

    expect(result?.coveragePercent).toBe(50);
    expect(result?.deficit).toBe(1);
    expect(result?.isAtRisk).toBe(true);
  });

  it('returns only critical occupations', async () => {
    const critical: OccupationCoverage = {
      occupationId: 2,
      occupationName: 'Guard',
      minimumRequiredWorkers: 1,
      preferredWorkers: 2,
      criticalThresholdPercent: '50.00',
      availableWorkers: 0,
      activeWorkers: 0,
      coveragePercent: 0,
      isCritical: true,
      isAtRisk: true,
      deficit: 1,
      surplus: 0,
      campId: 1,
    };

    jest.mocked(coverageRepository.getCriticalOccupationsByCamp).mockResolvedValue([critical]);

    const result = await coverageService.getCriticalOccupations(1);

    expect(result).toHaveLength(1);
    expect(result[0].isCritical).toBe(true);
  });

  it('suggests replacements only when occupation is at risk', async () => {
    const targetCoverage: OccupationCoverage = {
      occupationId: 1,
      occupationName: 'Doctor',
      minimumRequiredWorkers: 2,
      preferredWorkers: 3,
      criticalThresholdPercent: '50.00',
      availableWorkers: 0,
      activeWorkers: 0,
      coveragePercent: 0,
      isCritical: true,
      isAtRisk: true,
      deficit: 2,
      surplus: 0,
      campId: 1,
    };

    const surplusCoverage: OccupationCoverage = {
      occupationId: 2,
      occupationName: 'Chef',
      minimumRequiredWorkers: 3,
      preferredWorkers: 4,
      criticalThresholdPercent: '50.00',
      availableWorkers: 5,
      activeWorkers: 5,
      coveragePercent: 166.67,
      isCritical: false,
      isAtRisk: false,
      deficit: 0,
      surplus: 2,
      campId: 1,
    };

    jest.mocked(coverageRepository.getOccupationCoverageById).mockResolvedValue(targetCoverage);
    jest.mocked(coverageRepository.getOccupationCoverageByCamp).mockResolvedValue([
      targetCoverage,
      surplusCoverage,
    ]);
    jest.mocked(coverageRepository.getAvailablePersonsForReplacement).mockResolvedValue([
      { id: 101, name: 'Alice', lastName1: 'Smith', currentStatus: 'ACTIVE' },
      { id: 102, name: 'Bob', lastName1: 'Jones', currentStatus: 'ACTIVE' },
    ]);

    const result = await coverageService.getSuggestedReplacements(1, 1);

    expect(result).toHaveLength(2);
    expect(result[0].personId).toBe(101);
  });

  it.each(['SICK', 'INJURED', 'OUTSIDE_CAMP', 'ON_EXPEDITION'])(
    'rejects temporary assignment when person status is %s',
    async (status) => {
      personRepo.findOne.mockResolvedValue({
        id: 1,
        name: 'Juan',
        lastName1: 'Perez',
        currentStatus: status,
        campId: 1,
        occupationId: 2,
      });
      personRepo.exist.mockResolvedValue(true);
      genericRepo.exist.mockResolvedValue(true);

      await expect(
        assignmentService.createAssignment({
          personId: 1,
          temporaryOccupationId: 2,
          assignedBy: 1,
          reason: 'Coverage',
        }),
      ).rejects.toThrow(BadRequestException);
    },
  );

  it('rejects reassignment if source occupation would drop below minimum', async () => {
    personRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Juan',
      lastName1: 'Perez',
      currentStatus: 'ACTIVE',
      campId: 1,
      occupationId: 1,
    });
    personRepo.exist.mockResolvedValue(true);
    genericRepo.exist.mockResolvedValue(true);

    jest.mocked(coverageRepository.getOccupationCoverageById).mockResolvedValue({
      occupationId: 1,
      occupationName: 'Doctor',
      minimumRequiredWorkers: 2,
      preferredWorkers: 3,
      criticalThresholdPercent: '50.00',
      availableWorkers: 2,
      activeWorkers: 2,
      coveragePercent: 100,
      isCritical: false,
      isAtRisk: false,
      deficit: 0,
      surplus: 0,
      campId: 1,
    });

    await expect(
      assignmentService.createAssignment({
        personId: 1,
        temporaryOccupationId: 2,
        assignedBy: 1,
        reason: 'Coverage',
      }),
    ).rejects.toThrow(/below minimum coverage/);
  });

  it('creates temporary assignment when coverage is safe', async () => {
    personRepo.findOne.mockResolvedValue({
      id: 1,
      name: 'Juan',
      lastName1: 'Perez',
      currentStatus: 'ACTIVE',
      campId: 1,
      occupationId: 1,
    });
    personRepo.exist.mockResolvedValue(true);
    genericRepo.exist.mockResolvedValue(true);

    jest.mocked(coverageRepository.getOccupationCoverageById).mockResolvedValue({
      occupationId: 1,
      occupationName: 'Chef',
      minimumRequiredWorkers: 2,
      preferredWorkers: 3,
      criticalThresholdPercent: '50.00',
      availableWorkers: 5,
      activeWorkers: 5,
      coveragePercent: 250,
      isCritical: false,
      isAtRisk: false,
      deficit: 0,
      surplus: 3,
      campId: 1,
    });

    assignmentRepository.create.mockResolvedValue({
      id: 100,
      personId: 1,
      temporaryOccupationId: 2,
      startDate: new Date(),
      endDate: null,
      reason: 'Coverage',
      assignedBy: 1,
    });
    assignmentRepository.findPersonById.mockResolvedValue({
      id: 1,
      name: 'Juan',
      lastName1: 'Perez',
      campId: 1,
    });
    assignmentRepository.findOccupationById.mockResolvedValue({ id: 2, name: 'Nurse' });
    assignmentRepository.findActiveLinkedUserByPersonAndCamp.mockResolvedValue(null);

    const result = await assignmentService.createAssignment({
      personId: 1,
      temporaryOccupationId: 2,
      assignedBy: 1,
      reason: 'Coverage',
    });

    expect(result.id).toBe(100);
    expect(assignmentRepository.create).toHaveBeenCalledTimes(1);
  });
});
