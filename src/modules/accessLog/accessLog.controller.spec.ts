import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccessLogController } from './accessLog.controller';
import { AccessLogService } from './accessLog.service';
import type { Request } from 'express';

describe('AccessLogController', () => {
  let controller: AccessLogController;
  let service: jest.Mocked<AccessLogService>;

  const mockUser = { userId: 1, campId: 10, rol: 'SYSTEM_ADMIN' };
  const mockRequest = { user: mockUser } as unknown as Request;

  beforeEach(() => {
    service = {
      createLog: jest.fn(),
      getLogById: jest.fn(),
      getAllLogs: jest.fn(),
      updateLog: jest.fn(),
      deleteLog: jest.fn(),
    } as any;
    controller = new AccessLogController(service);
  });

  describe('create', () => {
    it('should create a log successfully', async () => {
      const body = { campId: 10, userId: 1 } as any;
      service.createLog.mockResolvedValue({ id: 1, ...body });

      const result = await controller.create(body, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createLog).toHaveBeenCalledWith(body);
    });

    it('should throw BadRequestException if campId mismatch', async () => {
      const body = { campId: 20 } as any;
      await expect(controller.create(body, mockRequest)).rejects.toThrow(
        'You cannot create logs for another camp',
      );
    });

    it('should throw BadRequestException if user context is invalid', async () => {
      const invalidReq = { user: {} } as any;
      await expect(controller.create({ campId: 10 } as any, invalidReq)).rejects.toThrow(
        'Authenticated user context is invalid',
      );
    });

    it('should throw BadRequestException on service error', async () => {
      service.createLog.mockRejectedValue(new Error('Test error'));
      await expect(controller.create({ campId: 10 } as any, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getById', () => {
    it('should return a log', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 10 } as any);
      const result = await controller.getById('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if campId mismatch', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 20 } as any);
      await expect(controller.getById('1', mockRequest)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if log not found', async () => {
      service.getLogById.mockResolvedValue(null);
      await expect(controller.getById('1', mockRequest)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(controller.getById('abc', mockRequest)).rejects.toThrow('Invalid ID');
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.getAllLogs.mockResolvedValue({ data: [], total: 0 });
      const result = await controller.getAll(
        '1',
        '10',
        '100',
        'LOGIN' as any,
        '1',
        '10',
        mockRequest,
      );
      expect(result.success).toBe(true);
      expect(service.getAllLogs).toHaveBeenCalledWith(expect.objectContaining({ campId: 10 }));
    });

    it('should throw BadRequestException if request context is missing', async () => {
      await expect(controller.getAll()).rejects.toThrow('Request context is required');
    });

    it('should throw BadRequestException if query params are invalid', async () => {
      await expect(
        controller.getAll(
          'abc',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          mockRequest,
        ),
      ).rejects.toThrow('Invalid userId');
      await expect(
        controller.getAll(
          undefined,
          'abc',
          undefined,
          undefined,
          undefined,
          undefined,
          mockRequest,
        ),
      ).rejects.toThrow('Invalid campId');
      await expect(
        controller.getAll(
          undefined,
          undefined,
          'abc',
          undefined,
          undefined,
          undefined,
          mockRequest,
        ),
      ).rejects.toThrow('Invalid sessionId');
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, '0', undefined, mockRequest),
      ).rejects.toThrow('Invalid page');
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, '1', '0', mockRequest),
      ).rejects.toThrow('Invalid limit');
    });
  });

  describe('update', () => {
    it('should update a log', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 10 } as any);
      service.updateLog.mockResolvedValue({ id: 1, campId: 10 } as any);
      const result = await controller.update('1', { eventType: 'UPDATE' } as any, mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if log belongs to another camp', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 20 } as any);
      await expect(controller.update('1', {}, mockRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a log', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 10 } as any);
      service.deleteLog.mockResolvedValue(true);
      const result = await controller.delete('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if log not found', async () => {
      service.getLogById.mockResolvedValue(null);
      await expect(controller.delete('1', mockRequest)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on service error', async () => {
      service.getLogById.mockResolvedValue({ id: 1, campId: 10 } as any);
      service.deleteLog.mockRejectedValue(new Error('Test error'));
      await expect(controller.delete('1', mockRequest)).rejects.toThrow(BadRequestException);
    });
  });
});
