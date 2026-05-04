import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExpeditionParticipantController } from './expeditionParticipant.controller';
import type { ExpeditionParticipantService } from './expeditionParticipant.service';
import type { Request } from 'express';

describe('ExpeditionParticipantController', () => {
  let controller: ExpeditionParticipantController;
  let service: jest.Mocked<ExpeditionParticipantService>;

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
      assertExpeditionCampAccess: jest.fn(),
      assertParticipantCampAccess: jest.fn(),
      createParticipant: jest.fn(),
      getParticipantById: jest.fn(),
      getAllParticipants: jest.fn(),
      updateParticipant: jest.fn(),
    } as any;
    controller = new ExpeditionParticipantController(service);
  });

  describe('create', () => {
    it('should create a participant for authorized camp', async () => {
      const dto = { expeditionId: 1 } as any;
      service.assertExpeditionCampAccess.mockResolvedValue(undefined);
      service.createParticipant.mockResolvedValue({ id: 10, ...dto } as any);

      const result = await controller.create(dto, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createParticipant).toHaveBeenCalledWith(dto);
    });

    it('should throw if expedition camp access denied', async () => {
      const dto = { expeditionId: 1 } as any;
      service.assertExpeditionCampAccess.mockRejectedValue(new BadRequestException('Denied'));
      await expect(controller.create(dto, mockRequest)).rejects.toThrow('Denied');
    });
  });

  describe('getById', () => {
    it('should return a participant if authorized', async () => {
      service.assertParticipantCampAccess.mockResolvedValue(undefined);
      service.getParticipantById.mockResolvedValue({ id: 10 } as any);

      const result = await controller.getById('10', mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.assertExpeditionCampAccess.mockResolvedValue(undefined);
      service.getAllParticipants.mockResolvedValue({ data: [], total: 0 });

      const result = await controller.getAll('1', undefined, undefined, '1', '10', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if non-admin does not provide expeditionId', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, undefined, mockRequest),
      ).rejects.toThrow('Non-admin users must provide expeditionId');
    });
  });

  describe('update', () => {
    it('should update a participant', async () => {
      service.assertParticipantCampAccess.mockResolvedValue(undefined);
      service.updateParticipant.mockResolvedValue({ id: 10 } as any);

      const result = await controller.update('10', { status: 'CONFIRMED' } as any, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
