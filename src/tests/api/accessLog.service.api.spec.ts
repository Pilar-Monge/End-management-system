import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccessLogService } from '../../modules/accessLog/accessLog.service';

describe('AccessLogService (API service unit tests)', () => {
  let repository: any;
  let service: AccessLogService;

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
    service = new AccessLogService(repository);
  });

  it('createLog throws when user not found', async () => {
    repository.findUserById.mockResolvedValue(null);
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: null } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('createLog throws when user camp mismatch', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 2 });
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: null } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createLog throws when session not found', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1 });
    repository.findSessionById.mockResolvedValue(null);
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: 10 } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('createLog throws when session user mismatch', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1 });
    repository.findSessionById.mockResolvedValue({ id: 10, userId: 2, campId: 1 });
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: 10 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createLog throws when session camp mismatch', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1 });
    repository.findSessionById.mockResolvedValue({ id: 10, userId: 1, campId: 2 });
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: 10 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('createLog returns created log when valid', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1 });
    repository.findSessionById.mockResolvedValue({ id: 10, userId: 1, campId: 1 });
    repository.create.mockResolvedValue({ id: 5 });
    await expect(
      service.createLog({ userId: 1, campId: 1, sessionId: 10 } as any),
    ).resolves.toEqual({ id: 5 });
  });

  it('getAllLogs forwards filters with offset', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
    await service.getAllLogs({ campId: 2, page: 2, limit: 5 });
    expect(repository.findAllAndCount).toHaveBeenCalledWith({ campId: 2, offset: 5, limit: 5 });
  });

  it('updateLog returns null when missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.updateLog(1, { eventType: 'LOGIN' } as any)).resolves.toBeNull();
  });

  it('updateLog validates ownership and updates', async () => {
    repository.findById.mockResolvedValue({ id: 1, userId: 1, campId: 1, sessionId: 10 });
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1 });
    repository.findSessionById.mockResolvedValue({ id: 10, userId: 1, campId: 1 });
    repository.update.mockResolvedValue({ id: 1 });
    await expect(service.updateLog(1, { eventType: 'LOGOUT' } as any)).resolves.toEqual({ id: 1 });
  });

  it('deleteLog returns repository result', async () => {
    repository.delete.mockResolvedValue(true);
    await expect(service.deleteLog(1)).resolves.toBe(true);
  });
});
