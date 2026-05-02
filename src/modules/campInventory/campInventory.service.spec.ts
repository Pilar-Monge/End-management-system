import { CampInventoryService } from './campInventory.service';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('CampInventoryService', () => {
  let service: CampInventoryService;
  let repository: any;
  let notificationService: any;
  let dataSource: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByKey: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    notificationService = {
      notifyCampRoles: jest.fn(),
    };
    dataSource = {};
    service = new CampInventoryService(
      repository as never,
      dataSource as never,
      notificationService as never,
    );
  });

  describe('createItem', () => {
    it('should create an item and notify', async () => {
      const dto = { campId: 1, resourceTypeId: 10, currentAmount: '100' };
      repository.findByKey.mockResolvedValue(null);
      repository.create.mockResolvedValue(dto);

      const result = await service.createItem(dto as any);
      expect(result).toEqual(dto);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });

    it('should throw if already exists', async () => {
      repository.findByKey.mockResolvedValue({ id: 1 });
      await expect(service.createItem({ campId: 1, resourceTypeId: 10 } as any)).rejects.toThrow('Este elemento de inventario del campamento ya existe');
    });
  });

  describe('updateItem', () => {
    it('should update and notify', async () => {
      const updated = { campId: 1, resourceTypeId: 10, currentAmount: '200' };
      repository.update.mockResolvedValue(updated);

      const result = await service.updateItem(1, 10, { currentAmount: '200' });
      expect(result).toEqual(updated);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    it('should delete and notify', async () => {
      repository.findByKey.mockResolvedValue({ campId: 1, resourceTypeId: 10 });
      repository.delete.mockResolvedValue(true);

      const result = await service.deleteItem(1, 10);
      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
