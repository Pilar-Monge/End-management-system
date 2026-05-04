import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DailyCollectionRecordService } from './dailyCollectionRecord.service';
import type { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import type { InventoryMovementService } from '../inventoryMovement/inventoryMovement.service';
import type { NotificationService } from '../notification/notification.service';
import type { DataSource } from 'typeorm';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(true),
}));

describe('DailyCollectionRecordService', () => {
  let service: DailyCollectionRecordService;

  const repository = {
    findPersonById: jest.fn(),
    findUserById: jest.fn(),
    findMovementById: jest.fn(),
    findByPersonResourceDay: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAllAndCount: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<DailyCollectionRecordRepository>;

  const inventoryMovementService = {
    createMovement: jest.fn(),
  } as unknown as jest.Mocked<InventoryMovementService>;

  const notificationService = {
    notifyCampRoles: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const dataSource = {} as unknown as jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new DailyCollectionRecordService(
      repository,
      inventoryMovementService,
      notificationService,
      dataSource,
    );
  });

  describe('createRecord', () => {
    const validDto = {
      campId: 1,
      personId: 1,
      recordedBy: 1,
      resourceTypeId: 1,
      expectedAmount: '10.00',
      actualAmount: '10.00',
      date: new Date('2026-05-01'),
    };

    it('throws if person not found', async () => {
      repository.findPersonById.mockResolvedValue(null);
      await expect(service.createRecord(validDto)).rejects.toThrow(NotFoundException);
    });

    it('throws if person camp mismatches', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 2 } as never);
      await expect(service.createRecord(validDto)).rejects.toThrow(BadRequestException);
    });

    it('throws if recordedBy user not found', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue(null);
      await expect(service.createRecord(validDto)).rejects.toThrow(NotFoundException);
    });

    it('throws if recordedBy user camp mismatches', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 2 } as never);
      await expect(service.createRecord(validDto)).rejects.toThrow(BadRequestException);
    });

    it('throws if movementId is provided but not found', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findMovementById.mockResolvedValue(null);
      await expect(service.createRecord({ ...validDto, movementId: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws if movement camp mismatches', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findMovementById.mockResolvedValue({
        id: 1,
        campId: 2,
        resourceTypeId: 1,
      } as never);
      await expect(service.createRecord({ ...validDto, movementId: 1 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws if existing record for same person, resource and date', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findByPersonResourceDay.mockResolvedValue({ id: 1 } as never);

      await expect(service.createRecord(validDto)).rejects.toThrow(
        'Ya existe un registro de recoleccion diaria',
      );
    });

    it('creates record and notifies', async () => {
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findByPersonResourceDay.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);

      const result = await service.createRecord(validDto);
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('adjustRecord', () => {
    it('returns null if record not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(
        service.adjustRecord(1, { actualAmount: '10.00', recordedBy: 1 }),
      ).resolves.toBeNull();
    });

    it('throws if user not found', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue(null);
      await expect(
        service.adjustRecord(1, { actualAmount: '10.00', recordedBy: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws if user camp mismatches', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 2 } as never);
      await expect(
        service.adjustRecord(1, { actualAmount: '10.00', recordedBy: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws if actualAmount is invalid', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1, actualAmount: '10.00' } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      await expect(
        service.adjustRecord(1, { actualAmount: '-5.00', recordedBy: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates without movement if delta is 0', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1, actualAmount: '10.00' } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.update.mockResolvedValue({ id: 1, actualAmount: '10.00' } as never);

      const result = await service.adjustRecord(1, { actualAmount: '10.00', recordedBy: 1 });
      expect(result).toBeDefined();
      expect(inventoryMovementService.createMovement).not.toHaveBeenCalled();
    });

    it('updates and creates movement if delta !== 0', async () => {
      const existing = {
        id: 1,
        campId: 1,
        resourceTypeId: 1,
        actualAmount: '10.00',
        date: new Date('2026-05-01'),
      };
      repository.findById
        .mockResolvedValueOnce(existing as never)
        .mockResolvedValueOnce({ ...existing, actualAmount: '15.00', movementId: 99 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.update.mockResolvedValue(existing as never);
      inventoryMovementService.createMovement.mockResolvedValue({ id: 99 } as never);

      const result = await service.adjustRecord(1, { actualAmount: '15.00', recordedBy: 1 });
      expect(inventoryMovementService.createMovement).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: '5.00',
          movementType: 'MANUAL_ADJUSTMENT',
        }),
      );
      expect(repository.update).toHaveBeenCalledWith(1, { movementId: 99 });
      expect(result?.movementId).toBe(99);
    });
  });

  describe('getAllRecords', () => {
    it('fetches with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

      await service.getAllRecords({ page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('updateRecord', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateRecord(1, {})).resolves.toBeNull();
    });

    it('updates and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findPersonById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.findUserById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.update.mockResolvedValue({ id: 1, campId: 1 } as never);

      const result = await service.updateRecord(1, {});
      expect(result?.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('deleteRecord', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteRecord(1)).resolves.toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.delete.mockResolvedValue(false);
      await expect(service.deleteRecord(1)).resolves.toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.delete.mockResolvedValue(true);

      await expect(service.deleteRecord(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
