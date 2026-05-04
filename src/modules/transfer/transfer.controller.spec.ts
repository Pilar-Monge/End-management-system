import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import type { TransferService } from './transfer.service';
import type { Request } from 'express';
import type { DataSource } from 'typeorm';

describe('TransferController', () => {
  let controller: TransferController;
  let service: jest.Mocked<TransferService>;
  let dataSource: jest.Mocked<DataSource>;

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
      createTransfer: jest.fn(),
      getTransferById: jest.fn(),
      getAllTransfers: jest.fn(),
      updateTransfer: jest.fn(),
    } as any;
    dataSource = {
      query: jest.fn(),
    } as any;
    controller = new TransferController(service, dataSource);
  });

  describe('create', () => {
    it('should create a transfer for authorized camp', async () => {
      const dto = { requestId: 1 } as any;
      dataSource.query.mockResolvedValue([{ id: 1, origin_camp_id: 1, destination_camp_id: 2 }]);
      service.createTransfer.mockResolvedValue({ id: 10, ...dto } as any);

      const result = await controller.create(dto, mockRequest);

      expect(result.success).toBe(true);
      expect(service.createTransfer).toHaveBeenCalledWith(dto);
    });

    it('should throw if request camp mismatch', async () => {
      const dto = { requestId: 1 } as any;
      dataSource.query.mockResolvedValue([{ id: 1, origin_camp_id: 3, destination_camp_id: 4 }]);
      await expect(controller.create(dto, mockRequest)).rejects.toThrow(
        'You can only access transfers involving your camp',
      );
    });
  });

  describe('getById', () => {
    it('should return a transfer if authorized', async () => {
      dataSource.query.mockResolvedValue([{ origin_camp_id: 1, destination_camp_id: 2 }]);
      service.getTransferById.mockResolvedValue({ id: 10 } as any);

      const result = await controller.getById('10', mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      dataSource.query.mockResolvedValue([{ origin_camp_id: 1, destination_camp_id: 2 }]);
      service.getAllTransfers.mockResolvedValue({ data: [], total: 0 });

      const result = await controller.getAll('1', undefined, '1', '10', mockRequest);
      expect(result.success).toBe(true);
    });

    it('should throw if non-admin does not provide requestId', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, mockRequest),
      ).rejects.toThrow('Non-admin users must provide requestId');
    });
  });

  describe('update', () => {
    it('should update a transfer', async () => {
      dataSource.query.mockResolvedValue([{ origin_camp_id: 1, destination_camp_id: 2 }]);
      service.updateTransfer.mockResolvedValue({ id: 10 } as any);

      const result = await controller.update('10', { requestId: 1 } as any, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
