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
      const data = {
        personId: 1,
        previousStatus: 'ACTIVE',
        newStatus: 'INACTIVE',
        changedBy: 5,
      } as any;
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

    it('should throw NotFoundException if changed by not found', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('CHANGED_BY_NOT_FOUND'));
      await expect(service.createEntry({} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not system admin', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('ONLY_SYSTEM_ADMIN'));
      await expect(service.createEntry({} as any)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if camp mismatch', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('CAMP_MISMATCH'));
      await expect(service.createEntry({} as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if previous status mismatch', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('PREVIOUS_STATUS_MISMATCH'));
      await expect(service.createEntry({} as any)).rejects.toThrow(BadRequestException);
    });

    it('should rethrow unknown errors', async () => {
      repository.createEntryTransactional.mockRejectedValue(new Error('UNKNOWN'));
      await expect(service.createEntry({} as any)).rejects.toThrow('UNKNOWN');
    });
  });

  describe('getEntryById', () => {
    it('should return the entry from repository', async () => {
      const mockEntry = { id: 1 };
      repository.findById.mockResolvedValue(mockEntry);
      const result = await service.getEntryById(1);
      expect(result).toBe(mockEntry);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllEntries', () => {
    it('should call repository with default pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      await service.getAllEntries();
      expect(repository.findAllAndCount).toHaveBeenCalledWith({ offset: 0, limit: 10 });
    });

    it('should call repository with filters and pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      const filters = {
        personId: 1,
        changedBy: 2,
        previousStatus: 'A' as any,
        newStatus: 'B' as any,
        page: 2,
        limit: 5,
      };
      await service.getAllEntries(filters);
      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        personId: 1,
        changedBy: 2,
        previousStatus: 'A',
        newStatus: 'B',
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('updateEntry', () => {
    it('should validate admin and update', async () => {
      const existing = { id: 10, personId: 1, changedBy: 5 };
      repository.findById.mockResolvedValue(existing);
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue({ role: 'SYSTEM_ADMIN', campId: 1 });
      repository.update.mockResolvedValue({
        ...existing,
        personId: 1,
        previousStatus: 'A',
        newStatus: 'B',
      });
      repository.findPersonCampInfo.mockResolvedValue({ campId: 1 });

      const result = await service.updateEntry(10, { personId: 1 });
      expect(result).toBeDefined();
      expect(repository.update).toHaveBeenCalled();
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });

    it('should return null if entry not found', async () => {
      repository.findById.mockResolvedValue(null);
      const result = await service.updateEntry(10, {});
      expect(result).toBeNull();
    });

    it('should throw NotFoundException if person not found during validation', async () => {
      repository.findById.mockResolvedValue({ personId: 1, changedBy: 5 });
      repository.findPersonById.mockResolvedValue(null);
      await expect(service.updateEntry(10, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found during validation', async () => {
      repository.findById.mockResolvedValue({ personId: 1, changedBy: 5 });
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue(null);
      await expect(service.updateEntry(10, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not SYSTEM_ADMIN', async () => {
      repository.findById.mockResolvedValue({ personId: 1, changedBy: 5 });
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue({ role: 'USER', campId: 1 });
      await expect(service.updateEntry(10, {})).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if camp mismatch', async () => {
      repository.findById.mockResolvedValue({ personId: 1, changedBy: 5 });
      repository.findPersonById.mockResolvedValue({ campId: 1 });
      repository.findUserById.mockResolvedValue({ role: 'SYSTEM_ADMIN', campId: 2 });

      await expect(service.updateEntry(10, {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteEntry', () => {
    it('should call repository delete', async () => {
      repository.delete.mockResolvedValue(true);
      const result = await service.deleteEntry(1);
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('notifyStatusChange', () => {
    it('should not notify if person camp info not found', async () => {
      const data = { personId: 1, previousStatus: 'A', newStatus: 'B' } as any;
      repository.createEntryTransactional.mockResolvedValue({ id: 10, ...data });
      repository.findPersonCampInfo.mockResolvedValue(null);

      await service.createEntry(data);
      expect(notificationService.notifyCampRoles).not.toHaveBeenCalled();
    });

    it('should not notify user if associated user not found', async () => {
      const data = { personId: 1, previousStatus: 'A', newStatus: 'B' } as any;
      repository.createEntryTransactional.mockResolvedValue({ id: 10, ...data });
      repository.findPersonCampInfo.mockResolvedValue({ campId: 1 });
      repository.findAssociatedUserByPersonAndCamp.mockResolvedValue(null);

      await service.createEntry(data);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUser).not.toHaveBeenCalled();
    });
  });
});
