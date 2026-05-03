import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PersonStatusHistoryService } from './personStatusHistory.service';

describe('PersonStatusHistoryService', () => {
  let service: PersonStatusHistoryService;
  let repository: any;
  let notificationService: any;

  beforeEach(() => {
    repository = {
      createEntryTransactional: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findPersonById: jest.fn(),
      findUserById: jest.fn(),
      findPersonCampInfo: jest.fn(),
      findAssociatedUserByPersonAndCamp: jest.fn(),
    };
    notificationService = {
      notifyCampRoles: jest.fn(),
      notifyUser: jest.fn(),
    };
    service = new PersonStatusHistoryService(repository as never, notificationService as never);
  });

  describe('createEntry', () => {
    it('should create an entry and notify', async () => {
      const data = { personId: 1, previousStatus: 'ACTIVE', newStatus: 'INACTIVE', changedBy: 5 } as any;
      repository.createEntryTransactional.mockResolvedValue({ id: 10, ...data });
      repository.findPersonCampInfo.mockResolvedValue({ campId: 1 });
      repository.findAssociatedUserByPersonAndCamp.mockResolvedValue({ id: 100 });

      const result = await service.createEntry(data);
      expect(result.id).toBe(10);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUser).toHaveBeenCalled();
    });

    it('should throw NotFoundException if person not found', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('PERSON_NOT_FOUND'));
      await expect(service.createEntry({} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not system admin', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('ONLY_SYSTEM_ADMIN'));
      await expect(service.createEntry({} as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateEntry', () => {
    it('should validate admin and update', async () => {
      const existing = { id: 10, personId: 1, changedBy: 5 };
      repository.findById.mockResolvedValue(existing);
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue({ role: 'SYSTEM_ADMIN', campId: 1 });
      repository.update.mockResolvedValue({ ...existing, previousStatus: 'A', newStatus: 'B' });
      repository.findPersonCampInfo.mockResolvedValue({ campId: 1 });

      const result = await service.updateEntry(10, { personId: 1 });
      expect(result).toBeDefined();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if camp mismatch', async () => {
      repository.findById.mockResolvedValue({ personId: 1, changedBy: 5 });
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue({ role: 'SYSTEM_ADMIN', campId: 2 });

      await expect(service.updateEntry(10, {})).rejects.toThrow(BadRequestException);
    });
  });
});
