import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccessLogService } from './accessLog.service';

describe('AccessLogService', () => {
  let service: AccessLogService;
  let repository: any;

  beforeEach(() => {
    repository = {
      findUserById: jest.fn(),
      findSessionById: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new AccessLogService(repository as never);
  });

  describe('createLog', () => {
    it('should create a log if validation passes', async () => {
      const data = { userId: 1, campId: 10, sessionId: 100 } as any;
      repository.findUserById.mockResolvedValue({ id: 1, campId: 10 });
      repository.findSessionById.mockResolvedValue({ id: 100, userId: 1, campId: 10 });
      repository.create.mockResolvedValue({ id: 1, ...data });

      const result = await service.createLog(data);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findUserById.mockResolvedValue(null);
      await expect(service.createLog({ userId: 1 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if campId mismatch', async () => {
      repository.findUserById.mockResolvedValue({ id: 1, campId: 20 });
      await expect(service.createLog({ userId: 1, campId: 10 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if session not found', async () => {
      repository.findUserById.mockResolvedValue({ id: 1, campId: 10 });
      repository.findSessionById.mockResolvedValue(null);
      await expect(service.createLog({ userId: 1, campId: 10, sessionId: 100 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if session userId mismatch', async () => {
      repository.findUserById.mockResolvedValue({ id: 1, campId: 10 });
      repository.findSessionById.mockResolvedValue({ id: 100, userId: 2, campId: 10 });
      await expect(service.createLog({ userId: 1, campId: 10, sessionId: 100 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if session campId mismatch', async () => {
      repository.findUserById.mockResolvedValue({ id: 1, campId: 10 });
      repository.findSessionById.mockResolvedValue({ id: 100, userId: 1, campId: 20 });
      await expect(service.createLog({ userId: 1, campId: 10, sessionId: 100 } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLogById', () => {
    it('should return log from repository', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      const result = await service.getLogById(1);
      expect(result.id).toBe(1);
    });
  });

  describe('getAllLogs', () => {
    it('should return all logs with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      const result = await service.getAllLogs({ page: 2, limit: 5 });
      expect(repository.findAllAndCount).toHaveBeenCalledWith({ offset: 5, limit: 5 });
    });

    it('should apply filters', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      await service.getAllLogs({ userId: 1, campId: 10, sessionId: 100, eventType: 'LOGIN' as any });
      expect(repository.findAllAndCount).toHaveBeenCalledWith(expect.objectContaining({
        userId: 1,
        campId: 10,
        sessionId: 100,
        eventType: 'LOGIN',
      }));
    });
  });

  describe('updateLog', () => {
    it('should update log if authorized', async () => {
      const existing = { id: 1, userId: 1, campId: 10, sessionId: 100 };
      repository.findById.mockResolvedValue(existing);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 10 });
      repository.findSessionById.mockResolvedValue({ id: 100, userId: 1, campId: 10 });
      repository.update.mockResolvedValue({ ...existing, eventType: 'UPDATE' });

      const result = await service.updateLog(1, { eventType: 'UPDATE' } as any);
      expect(result.eventType).toBe('UPDATE');
    });

    it('should return null if log not found', async () => {
      repository.findById.mockResolvedValue(null);
      const result = await service.updateLog(1, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteLog', () => {
    it('should delete log', async () => {
      repository.delete.mockResolvedValue(true);
      const result = await service.deleteLog(1);
      expect(result).toBe(true);
    });
  });
});
