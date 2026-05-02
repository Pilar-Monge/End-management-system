import { BadRequestException, ForbiddenException, NotFoundException, HttpException } from '@nestjs/common';
import { IntercampRequestController } from './intercampRequest.controller';
import type { IntercampRequestService } from './intercampRequest.service';
import type { Request } from 'express';

describe('IntercampRequestController', () => {
  let controller: IntercampRequestController;
  let service: jest.Mocked<IntercampRequestService>;

  const mockRequest = {
    user: {
      userId: 1,
      campId: 1,
      rol: 'RESOURCE_MANAGEMENT',
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
      createRequest: jest.fn(),
      getRequestById: jest.fn(),
      getAllRequests: jest.fn(),
      updateRequest: jest.fn(),
    } as any;
    controller = new IntercampRequestController(service);
  });

  describe('create', () => {
    it('should create a request for own camp', async () => {
      const dto = { originCampId: 1, createdBy: 1 } as any;
      service.createRequest.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(dto, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createRequest).toHaveBeenCalledWith(dto);
    });

    it('should throw if originCampId mismatch', async () => {
      const dto = { originCampId: 2, createdBy: 1 } as any;
      await expect(controller.create(dto, mockRequest)).rejects.toThrow('originCampId must match your authenticated camp');
    });

    it('should throw if createdBy mismatch', async () => {
      const dto = { originCampId: 1, createdBy: 2 } as any;
      await expect(controller.create(dto, mockRequest)).rejects.toThrow('createdBy must match the authenticated user');
    });

    it('should allow admin to create with any originCampId', async () => {
      const dto = { originCampId: 1, createdBy: 1 } as any;
      service.createRequest.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(dto, mockAdminRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('getById', () => {
    it('should return a request if authorized (origin)', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, originCampId: 1, destinationCampId: 2 } as any);
      const result = await controller.getById('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should return a request if authorized (destination)', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, originCampId: 3, destinationCampId: 1 } as any);
      const result = await controller.getById('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if unauthorized camp access', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, originCampId: 2, destinationCampId: 3 } as any);
      await expect(controller.getById('1', mockRequest)).rejects.toThrow('You do not have permission to view this intercamp request');
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.getAllRequests.mockResolvedValue({ data: [], total: 0 });
      const result = await controller.getAll('1', '2', 'PENDING' as any, '1', undefined, '1', '10', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if createdBy filter mismatch for non-admin', async () => {
      await expect(controller.getAll(undefined, undefined, undefined, '2', undefined, undefined, undefined, mockRequest)).rejects.toThrow('createdBy filter must match the authenticated user');
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, originCampId: 1 } as any);
      service.updateRequest.mockResolvedValue({ id: 1 } as any);

      const result = await controller.update('1', { originCampId: 1, createdBy: 1 } as any, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
