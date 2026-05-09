import { TransferHistoryService } from '../../modules/transferHistory/transferHistory.service';
import { TransferEntity } from '../../modules/transfer/transfer.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('TransferHistoryService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let transferRepo: any;
  let userRepo: any;
  let notificationService: any;
  let service: TransferHistoryService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      resolveTransferScope: jest.fn(),
    };
    transferRepo = { exist: jest.fn().mockResolvedValue(true) };
    userRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === TransferEntity) return transferRepo;
        if (entity === UserEntity) return userRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new TransferHistoryService(repository, notificationService, dataSource as any);
  });

  it('createEntry creates when valid with COMPLETED status', async () => {
    const dto = {
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
      recordedBy: 1,
    };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.createEntry(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createEntry creates when valid with CANCELED status', async () => {
    const dto = {
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'CANCELED',
      recordedBy: 1,
    };
    const created = { id: 2, ...dto };
    repository.create.mockResolvedValue(created);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.createEntry(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createEntry throws when transfer not found', async () => {
    const dto = {
      transferId: 999,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
      recordedBy: 1,
    };
    transferRepo.exist.mockResolvedValue(false);

    await expect(service.createEntry(dto as any)).rejects.toThrow();
  });

  it('createEntry throws when recorded by user not found', async () => {
    const dto = {
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
      recordedBy: 999,
    };
    userRepo.exist.mockResolvedValue(false);

    await expect(service.createEntry(dto as any)).rejects.toThrow();
  });

  it('getEntryById returns entry', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
    });

    const res = await service.getEntryById(1);
    expect(res).toEqual({
      id: 1,
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
    });
  });

  it('getEntryById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getEntryById(1);
    expect(res).toBeNull();
  });

  it('getAllEntries returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { id: 1, transferId: 1, previousStatus: 'PENDING', newStatus: 'COMPLETED' },
        { id: 2, transferId: 1, previousStatus: 'COMPLETED', newStatus: 'FINISHED' },
      ],
      total: 2,
    });

    const res = await service.getAllEntries({ transferId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateEntry returns updated entry', async () => {
    const updated = {
      id: 1,
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'IN_TRANSIT',
    };
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
    });
    repository.update.mockResolvedValue(updated);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.updateEntry(1, { newStatus: 'IN_TRANSIT' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateEntry returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateEntry(1, { newStatus: 'IN_TRANSIT' } as any);
    expect(res).toBeUndefined();
  });

  it('deleteEntry returns true when deleted', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      previousStatus: 'PENDING',
      newStatus: 'COMPLETED',
    });
    repository.delete.mockResolvedValue(true);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.deleteEntry(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteEntry returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteEntry(1);
    expect(res).toBe(false);
  });
});
