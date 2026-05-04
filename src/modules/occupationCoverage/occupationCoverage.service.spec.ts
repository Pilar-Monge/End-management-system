import { BadRequestException } from '@nestjs/common';
import { OccupationCoverageService } from './occupationCoverage.service';

describe('OccupationCoverageService', () => {
  let service: OccupationCoverageService;
  let repository: any;
  let tempAssignmentService: any;

  beforeEach(() => {
    repository = {
      getOccupationCoverageByCamp: jest.fn(),
      getOccupationCoverageById: jest.fn(),
      getCriticalOccupationsByCamp: jest.fn(),
      getAvailablePersonsForReplacement: jest.fn(),
    };
    tempAssignmentService = {
      createAssignment: jest.fn(),
    };
    service = new OccupationCoverageService(repository as never);
    service.setTemporaryAssignmentService(tempAssignmentService);
  });

  describe('getOccupationsAtRisk', () => {
    it('should return occupations that are at risk with suggestions', async () => {
      const mockCoverage = {
        occupationId: 1,
        occupationName: 'Doctor',
        campId: 1,
        isAtRisk: true,
        availableWorkers: 1,
        minimumRequiredWorkers: 3,
        coveragePercent: 33,
        deficit: 2,
        surplus: 0,
      };
      repository.getCriticalOccupationsByCamp.mockResolvedValue([mockCoverage]);
      repository.getOccupationCoverageById.mockResolvedValue(mockCoverage);
      repository.getOccupationCoverageByCamp.mockResolvedValue([
        mockCoverage,
        { occupationId: 2, occupationName: 'Nurse', surplus: 5, deficit: 0 },
      ]);
      repository.getAvailablePersonsForReplacement.mockResolvedValue([
        { id: 10, name: 'John', lastName1: 'Doe' },
      ]);

      const result = await service.getOccupationsAtRisk(1);
      expect(result).toHaveLength(1);
      expect(result[0].occupationName).toBe('Doctor');
      expect(result[0].suggestedReplacements).toHaveLength(1);
    });
  });

  describe('autoAssignReplacement', () => {
    it('should throw if service not initialized', async () => {
      service.setTemporaryAssignmentService(null);
      await expect(service.autoAssignReplacement(1, 1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should auto-assign top suggestion', async () => {
      const mockCoverage = {
        occupationId: 1,
        occupationName: 'Doctor',
        isAtRisk: true,
        deficit: 1,
      };
      repository.getOccupationCoverageById.mockResolvedValue(mockCoverage);
      repository.getOccupationCoverageByCamp.mockResolvedValue([
        mockCoverage,
        { occupationId: 2, occupationName: 'Nurse', surplus: 1 },
      ]);
      repository.getAvailablePersonsForReplacement.mockResolvedValue([
        { id: 10, name: 'John', lastName1: 'Doe' },
      ]);
      tempAssignmentService.createAssignment.mockResolvedValue({ id: 99 });

      const result = await service.autoAssignReplacement(1, 1, 1);
      expect(result.success).toBe(true);
      expect(tempAssignmentService.createAssignment).toHaveBeenCalled();
    });

    it('should return failure if no suggestions', async () => {
      repository.getOccupationCoverageById.mockResolvedValue({ isAtRisk: true });
      repository.getOccupationCoverageByCamp.mockResolvedValue([]);
      const result = await service.autoAssignReplacement(1, 1, 1);
      expect(result.success).toBe(false);
      expect(result.message).toContain('No available workers');
    });
  });
});
