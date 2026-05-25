import { CampInventoryService } from '../../modules/campInventory/campInventory.service';
import { CampEntity } from '../../modules/camp/camp.entity';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';

describe('CampInventoryService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let campRepo: any;
  let resourceTypeRepo: any;
  let notificationService: any;
  let service: CampInventoryService;

  beforeEach(() => {
    repository = {
      findByKey: jest.fn(),
      create: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    };
    campRepo = { exist: jest.fn().mockResolvedValue(true) };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === CampEntity) return campRepo;
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new CampInventoryService(repository, dataSource as any, notificationService);
  });

  it('createItem creates new item when valid', async () => {
    const dto = {
      campId: 1,
      resourceTypeId: 1,
      currentAmount: '10.00',
      minimumAlertAmount: '5.00',
    };
    const created = { id: 1, ...dto };
    repository.findByKey.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);

    const res = await service.createItem(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createItem throws when camp not found', async () => {
    const dto = {
      campId: 999,
      resourceTypeId: 1,
      currentAmount: '10.00',
      minimumAlertAmount: '5.00',
    };
    campRepo.exist.mockResolvedValue(false);

    await expect(service.createItem(dto as any)).rejects.toThrow();
  });

  it('createItem throws when resource type not found', async () => {
    const dto = {
      campId: 1,
      resourceTypeId: 999,
      currentAmount: '10.00',
      minimumAlertAmount: '5.00',
    };
    resourceTypeRepo.exist.mockResolvedValue(false);

    await expect(service.createItem(dto as any)).rejects.toThrow();
  });

  it('createItem throws if already exists', async () => {
    const dto = { campId: 1, resourceTypeId: 1 };
    repository.findByKey.mockResolvedValue({ campId: 1, resourceTypeId: 1 });

    await expect(service.createItem(dto as any)).rejects.toThrow(
      'Este elemento de inventario del campamento ya existe',
    );
  });

  it('getItem returns item', async () => {
    repository.findByKey.mockResolvedValue({
      campId: 1,
      resourceTypeId: 1,
      currentAmount: '20.00',
    });

    const res = await service.getItem(1, 1);
    expect(res).toEqual({ campId: 1, resourceTypeId: 1, currentAmount: '20.00' });
  });

  it('getItem returns null when not found', async () => {
    repository.findByKey.mockResolvedValue(null);

    const res = await service.getItem(1, 1);
    expect(res).toBeNull();
  });

  it('getAllItems returns all items', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { campId: 1, resourceTypeId: 1 },
        { campId: 1, resourceTypeId: 2 },
      ],
      total: 2,
    });

    const res = await service.getAllItems({ campId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateItem returns updated item', async () => {
    const updated = { campId: 1, resourceTypeId: 1, currentAmount: '30.00' };
    repository.update.mockResolvedValue(updated);

    const res = await service.updateItem(1, 1, { currentAmount: '30.00' });
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateItem returns null when not found', async () => {
    repository.update.mockResolvedValue(null);

    const res = await service.updateItem(1, 1, { currentAmount: '30.00' });
    expect(res).toBeNull();
  });

  it('deleteItem returns true when deleted', async () => {
    repository.findByKey.mockResolvedValue({ campId: 1, resourceTypeId: 1 });
    repository.delete.mockResolvedValue(true);

    const res = await service.deleteItem(1, 1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteItem returns false when not found', async () => {
    repository.findByKey.mockResolvedValue(null);

    const res = await service.deleteItem(1, 1);
    expect(res).toBe(false);
  });
});
