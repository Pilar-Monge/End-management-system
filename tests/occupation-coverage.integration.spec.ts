import { describe, it, expect, beforeEach, vi } from 'vitest';

import { OccupationCoverageScheduler } from '../src/modules/occupationCoverage/occupationCoverage.scheduler';
import { OccupationCoverageService } from '../src/modules/occupationCoverage/occupationCoverage.service';
import { TemporaryOccupationAssignmentEntity } from '../src/modules/temporaryOccupationAssignment/temporaryOccupationAssignment.entity';
import { PersonEntity } from '../src/modules/person/person.entity';
import type { OccupationCoverage } from '../src/modules/occupationCoverage/occupationCoverage.model';

describe('Occupation Coverage Scheduler Integration', () => {
  const coverageService = {
    getCriticalOccupations: vi.fn(),
    getSuggestedReplacements: vi.fn(),
  } as unknown as OccupationCoverageService;

  const assignmentRepository = {
    create: vi.fn(),
    save: vi.fn(),
  };

  const personRepo = {
    findOne: vi.fn(),
  };

  const dataSource = {
    query: vi.fn(),
    getRepository: vi.fn((entity) => {
      if (entity === TemporaryOccupationAssignmentEntity) {
        return assignmentRepository;
      }

      if (entity === PersonEntity) {
        return personRepo;
      }

      return null;
    }),
  };

  const notificationService = {
    notifyCampRoles: vi.fn(),
  };

  const scheduler = new OccupationCoverageScheduler(
    coverageService,
    dataSource as never,
    notificationService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('auto-assigns a worker when a critical gap has a suggestion', async () => {
    const criticalOccupation: OccupationCoverage = {
      occupationId: 1,
      occupationName: 'Doctor',
      minimumRequiredWorkers: 3,
      preferredWorkers: 5,
      criticalThresholdPercent: '50.00',
      availableWorkers: 0,
      activeWorkers: 0,
      coveragePercent: 0,
      isCritical: true,
      isAtRisk: true,
      deficit: 3,
      surplus: 0,
      campId: 1,
    };

    dataSource.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 77 }]);
    vi.mocked(coverageService.getCriticalOccupations).mockResolvedValue([criticalOccupation]);
    vi.mocked(coverageService.getSuggestedReplacements).mockResolvedValue([
      {
        personId: 101,
        personName: 'Alice Smith',
        currentOccupationId: 2,
        currentOccupationName: 'Chef',
        targetOccupationId: 1,
        targetOccupationName: 'Doctor',
        reason: 'Coverage',
        priority: 'HIGH',
      },
    ]);
    assignmentRepository.create.mockReturnValue({ id: 900 });
    assignmentRepository.save.mockResolvedValue({ id: 900 });
    personRepo.findOne.mockResolvedValue({ id: 101, name: 'Alice', lastName1: 'Smith' });

    await scheduler.checkCriticalOccupations();

    expect(assignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(1);
  });

  it('notifies admins when no replacement exists', async () => {
    const criticalOccupation: OccupationCoverage = {
      occupationId: 1,
      occupationName: 'Doctor',
      minimumRequiredWorkers: 3,
      preferredWorkers: 5,
      criticalThresholdPercent: '50.00',
      availableWorkers: 0,
      activeWorkers: 0,
      coveragePercent: 0,
      isCritical: true,
      isAtRisk: true,
      deficit: 3,
      surplus: 0,
      campId: 1,
    };

    dataSource.query.mockResolvedValueOnce([{ id: 1 }]);
    vi.mocked(coverageService.getCriticalOccupations).mockResolvedValue([criticalOccupation]);
    vi.mocked(coverageService.getSuggestedReplacements).mockResolvedValue([]);

    await scheduler.checkCriticalOccupations();

    expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(1);
  });

  it('handles multiple critical occupations in one camp', async () => {
    const criticalOccupations: OccupationCoverage[] = [
      {
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
      },
      {
        occupationId: 2,
        occupationName: 'Guard',
        minimumRequiredWorkers: 3,
        preferredWorkers: 4,
        criticalThresholdPercent: '50.00',
        availableWorkers: 0,
        activeWorkers: 0,
        coveragePercent: 0,
        isCritical: true,
        isAtRisk: true,
        deficit: 3,
        surplus: 0,
        campId: 1,
      },
    ];

    dataSource.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 77 }])
      .mockResolvedValueOnce([{ id: 77 }]);
    vi.mocked(coverageService.getCriticalOccupations).mockResolvedValue(criticalOccupations);
    vi.mocked(coverageService.getSuggestedReplacements).mockResolvedValue([
      {
        personId: 101,
        personName: 'Alice Smith',
        currentOccupationId: 2,
        currentOccupationName: 'Chef',
        targetOccupationId: 1,
        targetOccupationName: 'Doctor',
        reason: 'Coverage',
        priority: 'HIGH',
      },
    ]);
    assignmentRepository.create.mockReturnValue({ id: 900 });
    assignmentRepository.save.mockResolvedValue({ id: 900 });
    personRepo.findOne.mockResolvedValue({ id: 101, name: 'Alice', lastName1: 'Smith' });

    await scheduler.checkCriticalOccupations();

    expect(coverageService.getCriticalOccupations).toHaveBeenCalledTimes(1);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });
});
