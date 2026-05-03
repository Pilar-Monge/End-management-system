import { InventoryAlertService } from './inventoryAlert.service';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('InventoryAlertService', () => {
  let service: InventoryAlertService;
  let repository: any;
  let dataSource: any;
  let notificationService: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    dataSource = {};
    notificationService = {
      notifyCampRoles: jest.fn(),
    };
    service = new InventoryAlertService(
      repository as never,
      dataSource as never,
      notificationService as never,
    );
  });

  describe('createAlert', () => {
    it('should create an alert and notify', async () => {
      const dto = { campId: 1, resourceTypeId: 101, amountAtAlertGeneration: '5.00' };
      repository.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.createAlert(dto as any);

      expect(result.id).toBe(1);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('getAlertById', () => {
    it('should return an alert', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      const result = await service.getAlertById(1);
      expect(result?.id).toBe(1);
    });
  });

  describe('getAllAlerts', () => {
    it('should return paginated alerts', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      const result = await service.getAllAlerts({ page: 2, limit: 5 });
      expect(result.total).toBe(0);
      expect(repository.findAllAndCount).toHaveBeenCalledWith(expect.objectContaining({ offset: 5, limit: 5 }));
    });
  });

  describe('updateAlert', () => {
    it('should update and notify', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 });
      repository.update.mockResolvedValue({ id: 1, campId: 1, resolved: true });

      const result = await service.updateAlert(1, { resolved: true });
      expect(result?.resolved).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });

    it('should return null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      const result = await service.updateAlert(1, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteAlert', () => {
    it('should delete and notify', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 });
      repository.delete.mockResolvedValue(true);

      const result = await service.deleteAlert(1);
      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
