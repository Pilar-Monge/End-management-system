import { DeliveredTransferResourceService } from '../../modules/deliveredTransferResource/deliveredTransferResource.service';
import { TransferEntity } from '../../modules/transfer/transfer.entity';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';
import { InventoryMovementEntity } from '../../modules/inventoryMovement/inventoryMovement.entity';

describe('DeliveredTransferResourceService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let transferRepo: any;
  let resourceTypeRepo: any;
  let movementRepo: any;
  let notificationService: any;
  let service: DeliveredTransferResourceService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      resolveTransferScope: jest.fn(),
      findByTransferAndResourceType: jest.fn(),
    };
    transferRepo = { exist: jest.fn().mockResolvedValue(true) };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    movementRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === TransferEntity) return transferRepo;
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        if (entity === InventoryMovementEntity) return movementRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new DeliveredTransferResourceService(
      repository,
      notificationService,
      dataSource as any,
    );
  });

  it('createDeliveredResource creates when valid', async () => {
    const dto = {
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
      movementId: 1,
    };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.findByTransferAndResourceType.mockResolvedValue(null);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.createDeliveredResource(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createDeliveredResource throws when transfer not found', async () => {
    const dto = {
      transferId: 999,
      resourceTypeId: 1,
      quantity: '50.00',
      movementId: 1,
    };
    transferRepo.exist.mockResolvedValue(false);

    await expect(service.createDeliveredResource(dto as any)).rejects.toThrow();
  });

  it('createDeliveredResource throws when resource type not found', async () => {
    const dto = {
      transferId: 1,
      resourceTypeId: 999,
      quantity: '50.00',
      movementId: 1,
    };
    resourceTypeRepo.exist.mockResolvedValue(false);

    await expect(service.createDeliveredResource(dto as any)).rejects.toThrow();
  });

  it('createDeliveredResource throws when movement not found', async () => {
    const dto = {
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
      movementId: 999,
    };
    movementRepo.exist.mockResolvedValue(false);

    await expect(service.createDeliveredResource(dto as any)).rejects.toThrow();
  });

  it('createDeliveredResource throws when duplicate exists', async () => {
    const dto = {
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
      movementId: 1,
    };
    repository.findByTransferAndResourceType.mockResolvedValue({ id: 99 });

    await expect(service.createDeliveredResource(dto as any)).rejects.toThrow();
  });

  it('getDeliveredResourceById returns resource', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
    });

    const res = await service.getDeliveredResourceById(1);
    expect(res).toEqual({
      id: 1,
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
    });
  });

  it('getDeliveredResourceById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getDeliveredResourceById(1);
    expect(res).toBeNull();
  });

  it('getAllDeliveredResources returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { id: 1, transferId: 1, resourceTypeId: 1, quantity: '50.00' },
        { id: 2, transferId: 1, resourceTypeId: 2, quantity: '100.00' },
      ],
      total: 2,
    });

    const res = await service.getAllDeliveredResources({ transferId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateDeliveredResource returns updated resource', async () => {
    const updated = { id: 1, transferId: 1, resourceTypeId: 1, quantity: '75.00' };
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      resourceTypeId: 1,
      quantity: '50.00',
    });
    repository.update.mockResolvedValue(updated);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.updateDeliveredResource(1, { quantity: '75.00' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateDeliveredResource returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateDeliveredResource(1, { quantity: '75.00' } as any);
    expect(res).toBeNull();
  });

  it('deleteDeliveredResource returns true when deleted', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      resourceTypeId: 1,
    });
    repository.delete.mockResolvedValue(true);
    repository.resolveTransferScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.deleteDeliveredResource(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteDeliveredResource returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteDeliveredResource(1);
    expect(res).toBe(false);
  });
});
