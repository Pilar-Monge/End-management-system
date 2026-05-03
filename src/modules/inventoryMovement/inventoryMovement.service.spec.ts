import { BadRequestException } from '@nestjs/common';
import { InventoryMovementService } from './inventoryMovement.service';
import type { InventoryMovementRepository } from './inventoryMovement.repository';
import type { NotificationService } from '../notification/notification.service';
import type { DataSource } from 'typeorm';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(true),
}));

describe('InventoryMovementService', () => {
  let service: InventoryMovementService;
  
  const repository = {
    findCampInventory: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAllAndCount: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<InventoryMovementRepository>;

  const notificationService = {
    notifyCampRoles: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const dataSource = {} as unknown as jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new InventoryMovementService(
      repository,
      notificationService,
      dataSource,
    );
  });

  describe('createMovement', () => {
    const validDto = {
      campId: 1,
      resourceTypeId: 1,
      recordedBy: 1,
      amount: '5.00',
      movementType: 'MANUAL_ADJUSTMENT' as const,
      date: new Date(),
    };

    it('throws if amount is 0 for MANUAL_ADJUSTMENT', async () => {
      await expect(service.createMovement({ ...validDto, amount: '0' })).rejects.toThrow('La cantidad debe ser distinta de 0');
    });

    it('throws if amount is <= 0 for non MANUAL_ADJUSTMENT', async () => {
      await expect(service.createMovement({ ...validDto, movementType: 'DAILY_RATION', amount: '0' })).rejects.toThrow('La cantidad debe ser mayor que 0');
      await expect(service.createMovement({ ...validDto, movementType: 'DAILY_RATION', amount: '-5.00' })).rejects.toThrow('La cantidad debe ser mayor que 0');
    });

    it('throws if insufficient inventory for consumption movement', async () => {
      repository.findCampInventory.mockResolvedValue({ currentAmount: '2.00' } as never);
      await expect(service.createMovement({ ...validDto, movementType: 'DAILY_RATION', amount: '5.00' })).rejects.toThrow('Inventario insuficiente');
    });

    it('creates movement and does not notify if inventory is above minimum', async () => {
      repository.findCampInventory.mockResolvedValue({ currentAmount: '10.00', minimumAlertAmount: '5.00' } as never);
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);

      const result = await service.createMovement({ ...validDto, movementType: 'DAILY_RATION', amount: '2.00' });
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).not.toHaveBeenCalled();
    });

    it('creates movement and notifies if inventory is below minimum', async () => {
      repository.findCampInventory.mockResolvedValue({ currentAmount: '4.00', minimumAlertAmount: '5.00' } as never);
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);

      const result = await service.createMovement({ ...validDto, movementType: 'DAILY_RATION', amount: '2.00' });
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });

    it('creates movement and notifies if manual adjustment brings inventory below minimum', async () => {
      repository.findCampInventory.mockResolvedValue({ currentAmount: '4.00', minimumAlertAmount: '5.00' } as never);
      repository.create.mockResolvedValue({ id: 1, ...validDto, amount: '-2.00' } as never);

      const result = await service.createMovement({ ...validDto, movementType: 'MANUAL_ADJUSTMENT', amount: '-2.00' });
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });

    it('creates movement and does NOT notify if manual adjustment is positive', async () => {
      repository.create.mockResolvedValue({ id: 1, ...validDto, amount: '2.00' } as never);

      const result = await service.createMovement({ ...validDto, movementType: 'MANUAL_ADJUSTMENT', amount: '2.00' });
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).not.toHaveBeenCalled();
    });
  });

  describe('getAllMovements', () => {
    it('fetches with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

      await service.getAllMovements({ page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('updateMovement', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateMovement(1, {})).resolves.toBeNull();
    });

    it('updates and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.update.mockResolvedValue({ id: 1, campId: 1 } as never);

      const result = await service.updateMovement(1, { campId: 1, resourceTypeId: 1, recordedBy: 1 });
      expect(result?.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('deleteMovement', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteMovement(1)).resolves.toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.delete.mockResolvedValue(false);
      await expect(service.deleteMovement(1)).resolves.toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 } as never);
      repository.delete.mockResolvedValue(true);

      await expect(service.deleteMovement(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
