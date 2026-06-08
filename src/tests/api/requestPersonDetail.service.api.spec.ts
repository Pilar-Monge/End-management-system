import { RequestPersonDetailService } from '../../modules/requestPersonDetail/requestPersonDetail.service';
import { IntercampRequestEntity } from '../../modules/intercampRequest/intercampRequest.entity';
import { PersonEntity } from '../../modules/person/person.entity';
import { OccupationEntity } from '../../modules/occupation/occupation.entity';

describe('RequestPersonDetailService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let requestRepo: any;
  let personRepo: any;
  let occupationRepo: any;
  let notificationService: any;
  let service: RequestPersonDetailService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      resolveRequestScope: jest.fn(),
    };
    requestRepo = { exist: jest.fn().mockResolvedValue(true) };
    personRepo = { exist: jest.fn().mockResolvedValue(true) };
    occupationRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === IntercampRequestEntity) return requestRepo;
        if (entity === PersonEntity) return personRepo;
        if (entity === OccupationEntity) return occupationRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new RequestPersonDetailService(repository, notificationService, dataSource as any);
  });

  it('createDetail creates when valid with personId', async () => {
    const dto = { requestId: 1, personId: 1, detailType: 'REQUESTER' };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
      status: 'DRAFT',
    });

    const res = await service.createDetail(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createDetail creates when valid with occupationId', async () => {
    const dto = { requestId: 1, occupationId: 5, detailType: 'OCCUPATION_REQUIREMENT' };
    const created = { id: 2, ...dto };
    repository.create.mockResolvedValue(created);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
      status: 'DRAFT',
    });

    const res = await service.createDetail(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createDetail throws when request not found', async () => {
    const dto = { requestId: 999, personId: 1, detailType: 'REQUESTER' };
    requestRepo.exist.mockResolvedValue(false);

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('createDetail throws when person not found', async () => {
    const dto = { requestId: 1, personId: 999, detailType: 'REQUESTER' };
    personRepo.exist.mockResolvedValue(false);

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('createDetail throws when occupation not found', async () => {
    const dto = { requestId: 1, occupationId: 999, detailType: 'OCCUPATION_REQUIREMENT' };
    occupationRepo.exist.mockResolvedValue(false);

    await expect(service.createDetail(dto as any)).rejects.toThrow();
  });

  it('getDetailById returns detail', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      requestId: 1,
      personId: 1,
      detailType: 'REQUESTER',
    });

    const res = await service.getDetailById(1);
    expect(res).toEqual({
      id: 1,
      requestId: 1,
      personId: 1,
      detailType: 'REQUESTER',
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
        { id: 1, requestId: 1, personId: 1 },
        { id: 2, requestId: 1, occupationId: 5 },
      ],
      total: 2,
    });

    const res = await service.getAllDetails({ requestId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateDetail returns updated detail', async () => {
    const updated = { id: 1, requestId: 1, personId: 2, detailType: 'REQUESTER' };
    repository.findById.mockResolvedValue({ id: 1, requestId: 1, personId: 1 });
    repository.update.mockResolvedValue(updated);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
      status: 'PENDING',
    });

    const res = await service.updateDetail(1, { personId: 2 } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateDetail returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateDetail(1, { personId: 2 } as any);
    expect(res).toBeNull();
  });

  it('deleteDetail returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1, requestId: 1, personId: 1 });
    repository.delete.mockResolvedValue(true);
    repository.resolveRequestScope.mockResolvedValue({
      originCampId: 1,
      destinationCampId: 2,
      status: 'DRAFT',
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
