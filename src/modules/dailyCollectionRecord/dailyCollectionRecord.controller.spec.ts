import { BadRequestException, ForbiddenException, NotFoundException, HttpException } from '@nestjs/common';
import { DailyCollectionRecordController } from './dailyCollectionRecord.controller';
import type { DailyCollectionRecordService } from './dailyCollectionRecord.service';
import type { Request } from 'express';

describe('DailyCollectionRecordController', () => {
  let controller: DailyCollectionRecordController;
  let service: jest.Mocked<DailyCollectionRecordService>;

  const mockRequest = {
    user: {
      userId: 1,
      campId: 1,
      rol: 'WORKER',
    },
  } as unknown as Request;

  const mockAdminRequest = {
    user: {
      userId: 2,
      campId: 2,
      rol: 'SYSTEM_ADMIN',
    },
  } as unknown as Request;

  beforeEach(() => {
    service = {
      createRecord: jest.fn(),
      adjustRecord: jest.fn(),
      getRecordById: jest.fn(),
      getAllRecords: jest.fn(),
      updateRecord: jest.fn(),
    } as any;
    controller = new DailyCollectionRecordController(service);
  });

  describe('create', () => {
    it('should create a record for own camp', async () => {
      const dto = { campId: 1, recordedBy: 1 } as any;
      service.createRecord.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(dto, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createRecord).toHaveBeenCalledWith(dto);
    });

    it('should throw if camp mismatch', async () => {
      const dto = { campId: 2, recordedBy: 1 } as any;
      await expect(controller.create(dto, mockRequest)).rejects.toThrow('You can only create records in your own camp');
    });

    it('should throw if recordedBy mismatch', async () => {
      const dto = { campId: 1, recordedBy: 2 } as any;
      await expect(controller.create(dto, mockRequest)).rejects.toThrow('recordedBy must match the authenticated user');
    });
  });

  describe('adjust', () => {
    it('should adjust a record', async () => {
      service.getRecordById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.adjustRecord.mockResolvedValue({ id: 1, actualAmount: '15.00' } as any);

      const result = await controller.adjust('1', { recordedBy: 1, actualAmount: '15.00' } as any, mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if record not found', async () => {
      service.getRecordById.mockResolvedValue(null);
      await expect(controller.adjust('1', { recordedBy: 1 } as any, mockRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getById', () => {
    it('should return a record if authorized', async () => {
      service.getRecordById.mockResolvedValue({ id: 1, campId: 1 } as any);
      const result = await controller.getById('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if unauthorized camp access', async () => {
      service.getRecordById.mockResolvedValue({ id: 1, campId: 2 } as any);
      await expect(controller.getById('1', mockRequest)).rejects.toThrow('You do not have permission to view this record');
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.getAllRecords.mockResolvedValue({ data: [], total: 0 });
      const result = await controller.getAll('1', undefined, undefined, '2026-05-01', '1', '10', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if invalid date format', async () => {
      await expect(controller.getAll(undefined, undefined, undefined, 'invalid', undefined, undefined, mockRequest)).rejects.toThrow('Invalid date');
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      service.getRecordById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.updateRecord.mockResolvedValue({ id: 1 } as any);

      const result = await controller.update('1', { campId: 1, recordedBy: 1 } as any, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
