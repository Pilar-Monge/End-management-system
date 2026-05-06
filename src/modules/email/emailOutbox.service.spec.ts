import { EmailOutboxService } from './emailOutbox.service';

describe('EmailOutboxService', () => {
  let repo: any;
  let service: EmailOutboxService;

  beforeEach(() => {
    repo = {
      createPendingEntry: jest.fn().mockResolvedValue({ id: 1 }),
      findDueForDelivery: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue({ id: 2 }),
    } as any;

    service = new EmailOutboxService(repo);
    delete process.env.EMAIL_MAX_ATTEMPTS;
  });

  it('enqueue uses explicit maxAttempts when provided', async () => {
    const entry = { to: 'a', subject: 's', body: 'b', maxAttempts: 3 } as any;
    await service.enqueue(entry);
    expect(repo.createPendingEntry).toHaveBeenCalledWith(entry, 3);
  });

  it('enqueue uses EMAIL_MAX_ATTEMPTS env when explicit not provided', async () => {
    process.env.EMAIL_MAX_ATTEMPTS = '7';
    const entry = { to: 'a', subject: 's', body: 'b' } as any;
    await service.enqueue(entry);
    expect(repo.createPendingEntry).toHaveBeenCalledWith(entry, 7);
  });

  it('enqueueMany calls enqueue for each entry', async () => {
    const spy = jest.spyOn(service as any, 'enqueue');
    const entries = [
      { to: 'a' } as any,
      { to: 'b' } as any,
    ];
    await service.enqueueMany(entries);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('findDueForDelivery delegates to repository', async () => {
    const now = new Date();
    await service.findDueForDelivery(5, now);
    expect(repo.findDueForDelivery).toHaveBeenCalledWith(5, now);
  });

  it('save delegates to repository', async () => {
    const entity = { id: 2 } as any;
    await service.save(entity);
    expect(repo.save).toHaveBeenCalledWith(entity);
  });
});
