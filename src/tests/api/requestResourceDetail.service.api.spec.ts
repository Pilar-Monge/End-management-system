import { RequestResourceDetailService } from '../../modules/requestResourceDetail/requestResourceDetail.service';
import { IntercampRequestEntity } from '../../modules/intercampRequest/intercampRequest.entity';
import { ResourceTypeEntity } from '../../modules/resourceType/resourceType.entity';

describe('RequestResourceDetailService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let requestRepo: any;
  let resourceTypeRepo: any;
  let notificationService: any;
  let service: RequestResourceDetailService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      resolveRequestScope: jest.fn(),
      findByRequestAndResourceType: jest.fn(),
    };
    requestRepo = { exist: jest.fn().mockResolvedValue(true) };
    resourceTypeRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === IntercampRequestEntity) return requestRepo;
        if (entity === ResourceTypeEntity) return resourceTypeRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new RequestResourceDetailService(repository, notificationService, dataSource as any);
  });

  it('createDetail creates when valid', async () => {
    const dto = {
      requestId: 1,
      resourceTypeId: 1,
      quantity: '100.00',
      estimatedValue: '5000.00',
    };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.findByRequestAndResourceType.mockResolvedValue(null);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.createDetail(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createDetail throws when request not found', async () => {
    const dto = {
      requestId: 999,
      resourceTypeId: 1,
      quantity: '100.00',
      estimatedValue: '5000.00',
    };
    requestRepo.exist.mockResolvedValue(false);

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('createDetail throws when resource type not found', async () => {
    const dto = {
      requestId: 1,
      resourceTypeId: 999,
      quantity: '100.00',
      estimatedValue: '5000.00',
    };
    resourceTypeRepo.exist.mockResolvedValue(false);

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('createDetail throws when duplicate exists', async () => {
    const dto = {
      requestId: 1,
      resourceTypeId: 1,
      quantity: '100.00',
      estimatedValue: '5000.00',
    };
    repository.findByRequestAndResourceType.mockResolvedValue({ id: 99 });

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('getDetailById returns detail', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      requestId: 1,
      resourceTypeId: 1,
      quantity: '100.00',
    });

    const res = await service.getDetailById(1);
    expect(res).toEqual({
      id: 1,
      requestId: 1,
      resourceTypeId: 1,
      quantity: '100.00',
    });
  });

  it('getDetailById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getDetailById(1);
    expect(res).toBeNull();
  });

  it('getAllDetails returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { id: 1, requestId: 1, resourceTypeId: 1, quantity: '100.00' },
        { id: 2, requestId: 1, resourceTypeId: 2, quantity: '50.00' },
      ],
      total: 2,
    });

    const res = await service.getAllDetails({ requestId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateDetail returns updated detail', async () => {
    const updated = { id: 1, requestId: 1, resourceTypeId: 1, quantity: '200.00' };
    repository.findById.mockResolvedValue({
      id: 1,
      requestId: 1,
      resourceTypeId: 1,
      quantity: '100.00',
    });
    repository.update.mockResolvedValue(updated);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.updateDetail(1, { quantity: '200.00' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateDetail returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateDetail(1, { quantity: '200.00' } as any);
    expect(res).toBeNull();
  });

  it('deleteDetail returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1, requestId: 1, resourceTypeId: 1 });
    repository.delete.mockResolvedValue(true);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
    });

    const res = await service.deleteDetail(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteDetail returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteDetail(1);
    expect(res).toBe(false);
  });
});
