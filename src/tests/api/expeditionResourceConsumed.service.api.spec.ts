import { ExpeditionResourceConsumedService } from '../../modules/expeditionResourceConsumed/expeditionResourceConsumed.service';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';
import { ExpeditionEntity } from '../../modules/expedition/expedition.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('ExpeditionResourceConsumedService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let resourceTypeRepo: any;
  let expeditionRepo: any;
  let userRepo: any;
  let notificationService: any;
  let service: ExpeditionResourceConsumedService;

  beforeEach(() => {
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    expeditionRepo = { exist: jest.fn().mockResolvedValue(true) };
    userRepo = { exist: jest.fn().mockResolvedValue(true) };
    repository = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findExpeditionById: jest.fn(),
      findUserById: jest.fn(),
      findByExpeditionAndResourceType: jest.fn(),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        if (entity === ExpeditionEntity) return expeditionRepo;
        if (entity === UserEntity) return userRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new ExpeditionResourceConsumedService(
      repository,
      dataSource as any,
      notificationService,
    );
  });

  it('createRecord creates when valid', async () => {
    const dto = {
      expeditionId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
      recordedBy: 1,
      consumptionType: 'DAILY_RATION',
    };
    const created = { id: 1, ...dto };
    resourceTypeRepo.exist.mockResolvedValue(true);
    repository.findExpeditionById.mockResolvedValue({ id: 1, status: 'IN_PROGRESS', campId: 1 });
    repository.findUserById.mockResolvedValue({
      id: 1,
      status: 'ACTIVE',
      role: 'RESOURCE_MANAGEMENT',
      campId: 1,
    });
    repository.findByExpeditionAndResourceType.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);

    const res = await service.createRecord(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createRecord throws when resource type not found', async () => {
    const dto = {
      expeditionId: 1,
      resourceTypeId: 999,
      quantity: '50.00',
      recordedBy: 1,
      consumptionType: 'DAILY_RATION',
    };
    resourceTypeRepo.exist.mockResolvedValue(false);

    await expect(service.createRecord(dto as any)).rejects.toThrow();
  });

  it('createRecord throws when expedition not found', async () => {
    const dto = {
      expeditionId: 999,
      resourceTypeId: 1,
      quantity: '50.00',
      recordedBy: 1,
      consumptionType: 'DAILY_RATION',
    };
    resourceTypeRepo.exist.mockResolvedValue(true);
    repository.findExpeditionById.mockResolvedValue(null);

    await expect(service.createRecord(dto as any)).rejects.toThrow();
  });

  it('getRecordById returns record', async () => {
    const record = { id: 1, expeditionId: 1, resourceTypeId: 1, quantity: '50.00' };
    repository.findById.mockResolvedValue(record);

    const res = await service.getRecordById(1);
    expect(res).toEqual(record);
  });

  it('getRecordById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getRecordById(1);
    expect(res).toBeNull();
  });

  it('getAllRecords returns list', async () => {
    const records = {
      data: [
        { id: 1, expeditionId: 1, resourceTypeId: 1, quantity: '50.00' },
        { id: 2, expeditionId: 1, resourceTypeId: 2, quantity: '100.00' },
      ],
      total: 2,
    };
    repository.findAllAndCount.mockResolvedValue(records);

    const res = await service.getAllRecords({ expeditionId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateRecord returns updated record', async () => {
    const updated = { id: 1, expeditionId: 1, resourceTypeId: 1, quantity: '75.00' };
    repository.findById.mockResolvedValue({
      id: 1,
      expeditionId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
    });
    repository.findExpeditionById.mockResolvedValue({ id: 1, status: 'IN_PROGRESS', campId: 1 });
    repository.findUserById.mockResolvedValue({
      id: 1,
      status: 'ACTIVE',
      role: 'RESOURCE_MANAGEMENT',
      campId: 1,
    });
    repository.update.mockResolvedValue(updated);

    const res = await service.updateRecord(1, { quantity: '75.00' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateRecord returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateRecord(1, { quantity: '75.00' } as any);
    expect(res).toBeNull();
  });

  it('deleteRecord returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1, expeditionId: 1, resourceTypeId: 1 });
    repository.findExpeditionById.mockResolvedValue({ id: 1, status: 'IN_PROGRESS', campId: 1 });
    repository.delete.mockResolvedValue(true);

    const res = await service.deleteRecord(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteRecord returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteRecord(1);
    expect(res).toBe(false);
  });
});
