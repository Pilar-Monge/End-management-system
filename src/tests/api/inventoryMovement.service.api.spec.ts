import { InventoryMovementService } from '../../modules/inventoryMovement/inventoryMovement.service';
import { CampInventoryEntity } from '../../modules/campInventory/campInventory.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';
import { CampEntity } from '../../modules/camp/camp.entity';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';

describe('InventoryMovementService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let inventoryRepo: any;
  let userRepo: any;
  let campRepo: any;
  let resourceTypeRepo: any;
  let notificationService: any;
  let service: InventoryMovementService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findCampInventory: jest.fn(),
    };
    inventoryRepo = { exist: jest.fn().mockResolvedValue(true) };
    userRepo = { exist: jest.fn().mockResolvedValue(true) };
    campRepo = { exist: jest.fn().mockResolvedValue(true) };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = { 
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === CampInventoryEntity) return inventoryRepo;
        if (entity === UserEntity) return userRepo;
        if (entity === CampEntity) return campRepo;
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    // Correct order: repository, notificationService, dataSource
    service = new InventoryMovementService(repository, notificationService, dataSource as any);
  });

  it('createMovement creates when valid', async () => {
    const dto = {
      campId: 1,
      resourceTypeId: 1,
      movementType: 'ADDITION',
      amount: 10,
      recordedBy: 1,
    };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.findCampInventory.mockResolvedValue({ currentAmount: '100.00', minimumAlertAmount: '10.00' });

    const res = await service.createMovement(dto as any);
    expect(res.id).toBe(1);
  });

  it('createMovement throws when camp not found', async () => {
    const dto = {
      campId: 999,
      resourceTypeId: 1,
      movementType: 'ADDITION',
      amount: 10,
      recordedBy: 1,
    };
    campRepo.exist.mockResolvedValue(false);

    await expect(service.createMovement(dto as any)).rejects.toThrow();
  });

  it('createMovement throws when resource type not found', async () => {
    const dto = {
      campId: 1,
      resourceTypeId: 999,
      movementType: 'ADDITION',
      amount: 10,
      recordedBy: 1,
    };
    resourceTypeRepo.exist.mockResolvedValue(false);

    await expect(service.createMovement(dto as any)).rejects.toThrow();
  });

  it('createMovement throws when recorded by user not found', async () => {
    const dto = {
      campId: 1,
      resourceTypeId: 1,
      movementType: 'ADDITION',
      amount: 10,
      recordedBy: 999,
    };
    userRepo.exist.mockResolvedValue(false);

    await expect(service.createMovement(dto as any)).rejects.toThrow();
  });

  it('getMovementById returns movement', async () => {
    repository.findById.mockResolvedValue({ id: 1, movementType: 'ADDITION' });

    const res = await service.getMovementById(1);
    expect(res).toEqual({ id: 1, movementType: 'ADDITION' });
  });

  it('getMovementById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getMovementById(1);
    expect(res).toBeNull();
  });

  it('getAllMovements returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { id: 1, movementType: 'ADDITION' },
        { id: 2, movementType: 'CONSUMPTION' },
      ],
      total: 2,
    });

    const res = await service.getAllMovements({ campId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateMovement returns updated movement', async () => {
    const updated = { id: 1, amount: 20, movementType: 'ADDITION' };
    repository.findById.mockResolvedValue({ id: 1, amount: 10 });
    repository.update.mockResolvedValue(updated);

    const res = await service.updateMovement(1, { amount: 20 } as any);
    expect(res.amount).toBe(20);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateMovement returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateMovement(1, { amount: 20 } as any);
    expect(res).toBeNull();
  });

  it('deleteMovement returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1 });
    repository.delete.mockResolvedValue(true);

    const res = await service.deleteMovement(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteMovement returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteMovement(1);
    expect(res).toBe(false);
  });
});
