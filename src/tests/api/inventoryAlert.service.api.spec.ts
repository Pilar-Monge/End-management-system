import { BadRequestException } from '@nestjs/common';
import { InventoryAlertService } from '../../modules/inventoryAlert/inventoryAlert.service';
import { CampEntity } from '../../modules/camp/camp.entity';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';
import { InventoryMovementEntity } from '../../modules/inventoryMovement/inventoryMovement.entity';

describe('InventoryAlertService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let campRepo: any;
  let resourceTypeRepo: any;
  let movementRepo: any;
  let notificationService: any;
  let service: InventoryAlertService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    campRepo = { exist: jest.fn().mockResolvedValue(true) };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    movementRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = { notifyCampRoles: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === CampEntity) return campRepo;
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        if (entity === InventoryMovementEntity) return movementRepo;
        return { exist: jest.fn() };
      }),
    };

    service = new InventoryAlertService(repository, dataSource as any, notificationService);
  });

  it('createAlert creates when valid', async () => {
    const dto = { campId: 1, resourceTypeId: 1, amountAtAlertGeneration: '10.00' };
    repository.create.mockResolvedValue({ id: 1, ...dto, resolved: false });

    const res = await service.createAlert(dto as any);
    expect(res.id).toBe(1);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('getAlertById returns alert', async () => {
    repository.findById.mockResolvedValue({ id: 1, campId: 1, resourceTypeId: 1 });

    const res = await service.getAlertById(1);
    expect(res).toEqual({ id: 1, campId: 1, resourceTypeId: 1 });
  });

  it('getAllAlerts returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [{ id: 1 }, { id: 2 }],
      total: 2,
    });

    const res = await service.getAllAlerts({ campId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateAlert returns updated alert', async () => {
    repository.findById.mockResolvedValue({ id: 1, resolved: false });
    repository.update.mockResolvedValue({ id: 1, resolved: true });

    const res = await service.updateAlert(1, { resolved: true });
    expect(res.resolved).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteAlert returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1 });
    repository.delete.mockResolvedValue(true);

    const res = await service.deleteAlert(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteAlert returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteAlert(1);
    expect(res).toBe(false);
  });
});
