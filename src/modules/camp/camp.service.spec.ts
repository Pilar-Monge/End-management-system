import { CampService } from './camp.service';

describe('CampService', () => {
  const repository = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findActiveSystemAdmins: jest.fn(),
  };

  const notificationService = {
    notifyUser: jest.fn(),
  };

  let service: CampService;

  const camp = {
    id: 1,
    name: 'Alpha Camp',
    status: 'ACTIVE',
    maxPersonCapacity: 100,
    minimumDailyRationPerPerson: 2,
    stockAlertThresholdPercentage: 30,
    foundationDate: new Date('2020-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CampService(repository as never, notificationService as never);
  });

  it('createCamp throws when name already exists', async () => {
    repository.findByName.mockResolvedValue(camp);

    await expect(service.createCamp({ name: 'Alpha Camp' } as never)).rejects.toThrow(
      'A camp with this name already exists',
    );
  });

  it('createCamp creates and notifies global admins', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(camp);
    repository.findActiveSystemAdmins.mockResolvedValue([
      { id: 10, campId: 1 },
      { id: 20, campId: 2 },
    ]);

    await expect(service.createCamp({ name: 'Alpha Camp' } as never)).resolves.toEqual(camp);

    expect(notificationService.notifyUser).toHaveBeenCalledTimes(2);
    expect(notificationService.notifyUser).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        type: 'USER_STATUS_UPDATED',
        sourceType: 'camp',
        sourceId: 1,
        email: expect.any(Object),
      }),
    );
  });

  it('getAllCamps builds default pagination filters', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [camp], total: 1 });

    await expect(service.getAllCamps()).resolves.toEqual({ data: [camp], total: 1 });
    expect(repository.findAllAndCount).toHaveBeenCalledWith({ offset: 0, limit: 10 });
  });

  it('updateCamp returns null when target camp is missing', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.updateCamp(77, { name: 'X' })).resolves.toBeNull();
  });

  it('updateCamp throws when another camp already has requested name', async () => {
    repository.findById.mockResolvedValue(camp);
    repository.findByName.mockResolvedValue({ id: 2, name: 'Beta Camp' });

    await expect(service.updateCamp(1, { name: 'Beta Camp' })).rejects.toThrow(
      'Another camp with this name already exists',
    );
  });

  it('updateCamp returns null when repository update fails', async () => {
    repository.findById.mockResolvedValue(camp);
    repository.update.mockResolvedValue(null);

    await expect(service.updateCamp(1, { description: 'new' } as never)).resolves.toBeNull();
  });

  it('updateCamp notifies with changed fields summary', async () => {
    repository.findById.mockResolvedValue(camp);
    repository.update.mockResolvedValue({
      ...camp,
      description: 'changed',
      maxPersonCapacity: 120,
    });
    repository.findActiveSystemAdmins.mockResolvedValue([{ id: 10, campId: 1 }]);

    const updated = await service.updateCamp(1, {
      description: 'changed',
      maxPersonCapacity: 120,
    } as never);

    expect(updated).toEqual({ ...camp, description: 'changed', maxPersonCapacity: 120 });
    expect(notificationService.notifyUser).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        title: 'Campamento actualizado',
        email: expect.objectContaining({
          payload: expect.objectContaining({
            changedFields: expect.arrayContaining([
              expect.objectContaining({ field: 'Descripcion', current: 'changed' }),
              expect.objectContaining({ field: 'Capacidad maxima', current: '120' }),
            ]),
          }),
        }),
      }),
    );
  });

  it('deleteCamp returns false when camp does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.deleteCamp(3)).resolves.toBe(false);
  });

  it('deleteCamp returns false without notification when delete fails', async () => {
    repository.findById.mockResolvedValue(camp);
    repository.delete.mockResolvedValue(false);

    await expect(service.deleteCamp(1)).resolves.toBe(false);
    expect(notificationService.notifyUser).not.toHaveBeenCalled();
  });

  it('deleteCamp notifies global admins when delete succeeds', async () => {
    repository.findById.mockResolvedValue(camp);
    repository.delete.mockResolvedValue(true);
    repository.findActiveSystemAdmins.mockResolvedValue([{ id: 10, campId: 1 }]);

    await expect(service.deleteCamp(1)).resolves.toBe(true);
    expect(notificationService.notifyUser).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        title: 'Campamento eliminado',
        sourceId: 1,
      }),
    );
  });
});
