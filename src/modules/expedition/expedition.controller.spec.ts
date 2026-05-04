import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { ExpeditionController } from './expedition.controller';
import type { ExpeditionService } from './expedition.service';
import type { Request } from 'express';

describe('ExpeditionController', () => {
  let controller: ExpeditionController;
  let service: jest.Mocked<ExpeditionService>;

  const mockRequest = {
    user: {
      userId: 1,
      campId: 1,
      rol: 'TRAVEL_MANAGER',
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
      createExpedition: jest.fn(),
      getActiveExplorations: jest.fn(),
      getExpeditionById: jest.fn(),
      getAllExpeditions: jest.fn(),
      updateExpedition: jest.fn(),
      completeExploration: jest.fn(),
      forceUpdateExpeditionState: jest.fn(),
    } as any;
    controller = new ExpeditionController(service);
  });

  describe('create', () => {
    it('should create an expedition for own camp', async () => {
      const dto = { campId: 1, name: 'Expe 1' } as any;
      service.createExpedition.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(dto, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createExpedition).toHaveBeenCalledWith(dto);
    });

    it('should allow admin to create for any camp', async () => {
      const dto = { campId: 1, name: 'Expe 1' } as any;
      service.createExpedition.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(dto, mockAdminRequest);

      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException if not admin and camp mismatch', async () => {
      const dto = { campId: 2, name: 'Expe 2' } as any;
      await expect(controller.create(dto, mockRequest)).rejects.toThrow(
        'You can only create expeditions in your own camp',
      );
    });
  });

  describe('getActive', () => {
    it('should return active explorations for own camp', async () => {
      service.getActiveExplorations.mockResolvedValue([]);
      const result = await controller.getActive('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if non-admin queries another camp', async () => {
      await expect(controller.getActive('2', mockRequest)).rejects.toThrow(
        'You cannot query active expeditions from another camp',
      );
    });
  });

  describe('getById', () => {
    it('should return an expedition if authorized', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 1 } as any);
      const result = await controller.getById('1', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if unauthorized camp access', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 2 } as any);
      await expect(controller.getById('1', mockRequest)).rejects.toThrow(
        'You do not have permission to view this expedition',
      );
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.getAllExpeditions.mockResolvedValue({ data: [], total: 0 });
      const result = await controller.getAll('1', undefined, '1', '10', mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an expedition', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.updateExpedition.mockResolvedValue({ id: 1, name: 'Updated' } as any);

      const result = await controller.update('1', { name: 'Updated' } as any, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('complete', () => {
    it('should complete an exploration', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.completeExploration.mockResolvedValue({ id: 1, status: 'COMPLETED' } as any);

      const result = await controller.complete('1', mockRequest as any);
      expect(result.success).toBe(true);
    });

    it('should throw ForbiddenException if service throws specific message', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.completeExploration.mockRejectedValue(
        new Error('Solo los participantes activos pueden completar esta expedicion'),
      );

      await expect(controller.complete('1', mockRequest as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('forceUpdateState', () => {
    it('should force update state', async () => {
      service.getExpeditionById.mockResolvedValue({ id: 1, campId: 1 } as any);
      service.forceUpdateExpeditionState.mockResolvedValue({ id: 1 } as any);

      const result = await controller.forceUpdateState('1', mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
