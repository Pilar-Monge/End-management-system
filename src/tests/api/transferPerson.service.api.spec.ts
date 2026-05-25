import { TransferPersonService } from '../../modules/transferPerson/transferPerson.service';
import { PersonEntity } from '../../modules/person/person.entity';
import { TransferEntity } from '../../modules/transfer/transfer.entity';
import { TransferService } from '../../modules/transfer/transfer.service';

describe('TransferPersonService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let personRepo: any;
  let transferRepo: any;
  let transferService: any;
  let notificationService: any;
  let service: TransferPersonService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findEligiblePersonIdsByCampAndOccupation: jest.fn(),
      findByTransferAndPerson: jest.fn(),
      resolveTransferScope: jest.fn().mockResolvedValue({
        originCampId: 1,
        destinationCampId: 2,
      }),
      findLinkedUserByPersonId: jest.fn().mockResolvedValue({
        id: 1,
        personId: 1,
        campId: 1,
      }),
    };
    personRepo = { exist: jest.fn().mockResolvedValue(true) };
    transferRepo = { exist: jest.fn().mockResolvedValue(true) };
    transferService = {
      getTransferById: jest.fn(),
      syncTransferRations: jest.fn().mockResolvedValue(undefined),
    };
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
      notifyUser: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === PersonEntity) return personRepo;
        if (entity === TransferEntity) return transferRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new TransferPersonService(
      repository,
      notificationService,
      transferService,
      dataSource as any,
    );
  });

  it('createTransferPerson creates when valid', async () => {
    const dto = {
      transferId: 1,
      personId: 1,
      status: 'ACTIVE',
    };
    const created = { id: 1, ...dto };
    repository.create.mockResolvedValue(created);
    repository.findByTransferAndPerson.mockResolvedValue(null);

    const res = await service.createTransferPerson(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createTransferPerson throws when transfer not found', async () => {
    const dto = {
      transferId: 999,
      personId: 1,
      status: 'ACTIVE',
    };
    transferRepo.exist.mockResolvedValue(false);

    await expect(service.createTransferPerson(dto as any)).rejects.toThrow();
  });

  it('createTransferPerson throws when person not found', async () => {
    const dto = {
      transferId: 1,
      personId: 999,
      status: 'ACTIVE',
    };
    personRepo.exist.mockResolvedValue(false);

    await expect(service.createTransferPerson(dto as any)).rejects.toThrow();
  });

  it('createTransferPerson throws when duplicate exists', async () => {
    const dto = {
      transferId: 1,
      personId: 1,
      status: 'ACTIVE',
    };
    repository.findByTransferAndPerson.mockResolvedValue({ id: 99 });

    await expect(service.createTransferPerson(dto as any)).rejects.toThrow();
  });

  it('canFulfillRequirements succeeds with valid requirements', async () => {
    const requirements = [
      { occupationId: 1, quantity: 2 },
      { occupationId: 2, quantity: 1 },
    ];
    repository.findEligiblePersonIdsByCampAndOccupation
      .mockResolvedValueOnce([1, 2, 3])
      .mockResolvedValueOnce([4, 5]);

    await expect(service.canFulfillRequirements(1, requirements)).resolves.not.toThrow();
  });

  it('canFulfillRequirements throws when not enough people', async () => {
    const requirements = [{ occupationId: 1, quantity: 5 }];
    repository.findEligiblePersonIdsByCampAndOccupation.mockResolvedValue([1, 2]);

    await expect(service.canFulfillRequirements(1, requirements)).rejects.toThrow();
  });

  it('canFulfillRequirements throws with invalid requirement occupationId', async () => {
    const requirements = [{ occupationId: -1, quantity: 1 }];

    await expect(service.canFulfillRequirements(1, requirements)).rejects.toThrow();
  });

  it('canFulfillRequirements throws with invalid requirement quantity', async () => {
    const requirements = [{ occupationId: 1, quantity: 0 }];

    await expect(service.canFulfillRequirements(1, requirements)).rejects.toThrow();
  });

  it('getTransferPersonById returns transfer person', async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      personId: 1,
      status: 'ACTIVE',
    });

    const res = await service.getTransferPersonById(1);
    expect(res).toEqual({
      id: 1,
      transferId: 1,
      personId: 1,
      status: 'ACTIVE',
    });
  });

  it('getTransferPersonById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getTransferPersonById(1);
    expect(res).toBeNull();
  });

  it('getAllTransferPeople returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [
        { id: 1, transferId: 1, personId: 1, status: 'ACTIVE' },
        { id: 2, transferId: 1, personId: 2, status: 'ACTIVE' },
      ],
      total: 2,
    });

    const res = await service.getAllTransferPeople({ transferId: 1 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('updateTransferPerson returns updated transfer person', async () => {
    const updated = { id: 1, transferId: 1, personId: 1, status: 'INACTIVE' };
    repository.findById.mockResolvedValue({
      id: 1,
      transferId: 1,
      personId: 1,
      status: 'ACTIVE',
    });
    repository.update.mockResolvedValue(updated);

    const res = await service.updateTransferPerson(1, { status: 'INACTIVE' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateTransferPerson returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateTransferPerson(1, { status: 'INACTIVE' } as any);
    expect(res).toBeNull();
  });

  it('deleteTransferPerson returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 1, transferId: 1, personId: 1 });
    repository.delete.mockResolvedValue(true);

    const res = await service.deleteTransferPerson(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteTransferPerson returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteTransferPerson(1);
    expect(res).toBe(false);
  });
});
