import { DeliveredTransferResourceService } from './deliveredTransferResource.service';
import type { DeliveredTransferResourceRepository } from './deliveredTransferResource.repository';
import type { NotificationService } from '../notification/notification.service';
import type { DataSource } from 'typeorm';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(true),
}));

describe('DeliveredTransferResourceService', () => {
  let service: DeliveredTransferResourceService;

  const repository = {
    resolveTransferScope: jest.fn(),
    resolveDeliveredScope: jest.fn(),
    findByTransferAndResourceType: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAllAndCount: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<DeliveredTransferResourceRepository>;

  const notificationService = {
    notifyCampRoles: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const dataSource = {} as unknown as jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new DeliveredTransferResourceService(repository, notificationService, dataSource);
  });

  describe('createDeliveredResource', () => {
    const validDto = {
      transferId: 1,
      resourceTypeId: 1,
      amount: '10.00',
    };

    it('throws if already exists', async () => {
      repository.findByTransferAndResourceType.mockResolvedValue({ id: 1 } as never);
      await expect(service.createDeliveredResource(validDto)).rejects.toThrow(
        'Este recurso entregado del traslado ya existe',
      );
    });

    it('creates and notifies', async () => {
      repository.findByTransferAndResourceType.mockResolvedValue(null);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);

      const result = await service.createDeliveredResource(validDto);
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllDeliveredResources', () => {
    it('fetches with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

      await service.getAllDeliveredResources({ page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('updateDeliveredResource', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateDeliveredResource(1, {})).resolves.toBeNull();
    });

    it('throws if changing transfer/resourceType and pair already exists', async () => {
      repository.findById.mockResolvedValue({ id: 1, transferId: 1, resourceTypeId: 1 } as never);
      repository.findByTransferAndResourceType.mockResolvedValue({ id: 2 } as never);

      await expect(service.updateDeliveredResource(1, { resourceTypeId: 2 })).rejects.toThrow(
        'Este recurso entregado del traslado ya existe',
      );
    });

    it('updates and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, transferId: 1, resourceTypeId: 1 } as never);
      repository.update.mockResolvedValue({ id: 1, transferId: 1, resourceTypeId: 1 } as never);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      const result = await service.updateDeliveredResource(1, { amount: '20.00' });
      expect(result?.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteDeliveredResource', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteDeliveredResource(1)).resolves.toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1, transferId: 1, resourceTypeId: 1 } as never);
      repository.delete.mockResolvedValue(false);
      await expect(service.deleteDeliveredResource(1)).resolves.toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, transferId: 1, resourceTypeId: 1 } as never);
      repository.delete.mockResolvedValue(true);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      await expect(service.deleteDeliveredResource(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  describe('scope assertions', () => {
    it('assertTransferCampAccess throws if transfer not in scope', async () => {
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      await expect(service.assertTransferCampAccess(10, 3)).rejects.toThrow(
        'You can only access delivered resources involving your camp',
      );
    });

    it('assertDeliveredCampAccess throws NotFound if no scope', async () => {
      repository.resolveDeliveredScope.mockResolvedValue(null);
      await expect(service.assertDeliveredCampAccess(99, 1)).rejects.toThrow(
        'Delivered transfer resource not found',
      );
    });

    it('assertDeliveredCampAccess throws if camp not in scope', async () => {
      repository.resolveDeliveredScope.mockResolvedValue({ originCampId: 7, destinationCampId: 8 });
      await expect(service.assertDeliveredCampAccess(5, 3)).rejects.toThrow(
        'You can only access delivered resources involving your camp',
      );
    });
  });
});
