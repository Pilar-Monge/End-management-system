import { NotificationService } from '../../modules/notification/notification.service';

describe('NotificationService (API-focused unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let emailOutboxService: any;
  let systemTimeService: any;
  let service: NotificationService;

  beforeEach(() => {
    repository = {
      findUserById: jest.fn(),
      findAllAndCount: jest.fn(),
      create: jest.fn(),
      findActiveUsersByCampAndRoles: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    dataSource = {
      getRepository: jest.fn().mockReturnValue({
        exist: jest.fn().mockResolvedValue(true),
        findOne: jest.fn().mockResolvedValue({ name: 'Camp A' }),
      }),
    };
    emailOutboxService = { enqueue: jest.fn() };
    systemTimeService = { now: jest.fn().mockReturnValue(new Date()) };

    service = new NotificationService(repository, dataSource as any, emailOutboxService, systemTimeService);
  });

  it('queueEmail returns early for empty email', async () => {
    await service.queueEmail({ toEmail: '   ', subject: 's' });
    expect(emailOutboxService.enqueue).not.toHaveBeenCalled();
  });

  it('queueEmail enqueues with payload and template default', async () => {
    await service.queueEmail({ toEmail: 'a@b.com', subject: 'hi' });
    expect(emailOutboxService.enqueue).toHaveBeenCalled();
  });

  it('createNotification throws when neither user nor role provided', async () => {
    await expect(service.createNotification({ campId: 1, type: 'TRANSFER_PENDING', title: 't', message: 'm' } as any)).rejects.toThrow();
  });

  it('createNotification validates camp and user via repository', async () => {
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1, email: 'u@x.com' });
    repository.create.mockResolvedValue({ id: 10 });
    await expect(service.createNotification({ campId: 1, userId: 1, type: 'TRANSFER_PENDING', title: 't', message: 'm' } as any)).resolves.toEqual({ id: 10 });
    expect(repository.create).toHaveBeenCalled();
  });

  it('notifyUser throws when user not found', async () => {
    repository.findUserById.mockResolvedValue(null);
    await expect(
      service.notifyUser(99, { campId: 1, type: 'TRANSFER_PENDING', title: 't', message: 'm' } as any),
    ).rejects.toThrow('Usuario destino de la notificacion no encontrado');
  });

  it('getAllNotifications forwards filters with defaults', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
    const res = await service.getAllNotifications({ campId: 1, page: 2, limit: 5 });
    expect(repository.findAllAndCount).toHaveBeenCalledWith({ campId: 1, offset: 5, limit: 5 });
    expect(res).toEqual({ data: [], total: 0 });
  });

  it('updateNotification returns null when missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.updateNotification(1, { read: true } as any)).resolves.toBeNull();
  });

  it('updateNotification sets readDate when read=true', async () => {
    repository.findById.mockResolvedValue({ id: 1, campId: 1, userId: 1, targetRole: null });
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1, email: 'u@x.com' });
    repository.update.mockResolvedValue({ id: 1, read: true });
    await service.updateNotification(1, { read: true } as any);
    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ readDate: expect.any(Date) }),
    );
  });

  it('updateNotification clears readDate when read=false', async () => {
    repository.findById.mockResolvedValue({ id: 1, campId: 1, userId: 1, targetRole: null });
    repository.findUserById.mockResolvedValue({ id: 1, campId: 1, email: 'u@x.com' });
    repository.update.mockResolvedValue({ id: 1, read: false });
    await service.updateNotification(1, { read: false } as any);
    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ readDate: null }),
    );
  });

  it('notifyCampRoles returns early on empty roles', async () => {
    await service.notifyCampRoles(1, [], { type: 'TRANSFER_PENDING', title: 't', message: 'm' } as any);
    // no exception, nothing called
  });
});
