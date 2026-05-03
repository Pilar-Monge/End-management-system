import { RequestResourceDetailService } from './requestResourceDetail.service';
import type { RequestResourceDetailRepository } from './requestResourceDetail.repository';
import type { NotificationService } from '../notification/notification.service';
import type { DataSource } from 'typeorm';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(true),
}));

describe('RequestResourceDetailService', () => {
  let service: RequestResourceDetailService;
  
  const repository = {
    resolveRequestScope: jest.fn(),
    findByRequestAndResourceType: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAllAndCount: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<RequestResourceDetailRepository>;

  const notificationService = {
    notifyCampRoles: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const dataSource = {} as unknown as jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new RequestResourceDetailService(
      repository,
      notificationService,
      dataSource,
    );
  });

  describe('createDetail', () => {
    const validDto = {
      requestId: 1,
      resourceTypeId: 1,
      quantity: 10,
    };

    it('throws if already exists', async () => {
      repository.findByRequestAndResourceType.mockResolvedValue({ id: 1 } as never);
      await expect(service.createDetail(validDto)).rejects.toThrow('Este detalle de recurso de solicitud ya existe');
    });

    it('creates and notifies', async () => {
      repository.findByRequestAndResourceType.mockResolvedValue(null);
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);

      const result = await service.createDetail(validDto);
      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDetailScope and getRequestScope', () => {
    it('getRequestScope returns scope', async () => {
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      await expect(service.getRequestScope(1)).resolves.toEqual({ originCampId: 1, destinationCampId: 2 });
    });

    it('getDetailScope returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getDetailScope(1)).resolves.toBeNull();
    });

    it('getDetailScope returns scope', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 1 } as never);
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      await expect(service.getDetailScope(1)).resolves.toEqual({ originCampId: 1, destinationCampId: 2 });
    });
  });

  describe('getAllDetails', () => {
    it('fetches with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

      await service.getAllDetails({ page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('updateDetail', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateDetail(1, {})).resolves.toBeNull();
    });

    it('throws if changing request/resourceType and pair already exists', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 } as never);
      repository.findByRequestAndResourceType.mockResolvedValue({ id: 2 } as never);

      await expect(service.updateDetail(1, { resourceTypeId: 2 })).rejects.toThrow('Este detalle de recurso de solicitud ya existe');
    });

    it('updates and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 } as never);
      repository.update.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 } as never);
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      const result = await service.updateDetail(1, { quantity: 20 });
      expect(result?.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteDetail', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteDetail(1)).resolves.toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 } as never);
      repository.delete.mockResolvedValue(false);
      await expect(service.deleteDetail(1)).resolves.toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 } as never);
      repository.delete.mockResolvedValue(true);
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      await expect(service.deleteDetail(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });
});
