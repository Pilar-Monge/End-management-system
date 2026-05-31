import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationController } from '../../modules/notification/notification.controller';

describe('NotificationController (API controller unit tests)', () => {
  let service: any;
  let controller: NotificationController;

  const makeReq = (userId = 1, campId = 10, rol = 'WORKER') =>
    ({ user: { userId, campId, rol } } as any);

  beforeEach(() => {
    service = {
      createNotification: jest.fn(),
      getNotificationById: jest.fn(),
      getAllNotifications: jest.fn(),
      updateNotification: jest.fn(),
    };
    controller = new NotificationController(service);
  });

  it('create returns success payload', async () => {
    service.createNotification.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Notification created successfully',
    });
  });

  it('create wraps non-http errors', async () => {
    service.createNotification.mockRejectedValue(new Error('boom'));
    await expect(controller.create({} as any, makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getNotificationById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById enforces ownership', async () => {
    service.getNotificationById.mockResolvedValue({ id: 1, userId: 2, campId: 10 });
    await expect(controller.getById('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById enforces camp match', async () => {
    service.getNotificationById.mockResolvedValue({ id: 1, userId: 1, campId: 99 });
    await expect(controller.getById('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById returns data when allowed', async () => {
    service.getNotificationById.mockResolvedValue({ id: 1, userId: 1, campId: 10 });
    await expect(controller.getById('1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1, userId: 1, campId: 10 },
    });
  });

  it('getAll rejects when request context missing', async () => {
    await expect(
      controller.getAll(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects camp mismatch', async () => {
    await expect(
      controller.getAll('99', undefined, undefined, undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllNotifications.mockResolvedValue({ data: [{ id: 1 }], total: 1 });
    const res = await controller.getAll(
      undefined,
      undefined,
      undefined,
      'true',
      '2',
      '5',
      makeReq(),
    );
    expect(res.pagination).toEqual({ page: 2, limit: 5, total: 1, pages: 1 });
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('', {} as any, makeReq())).rejects.toThrow(BadRequestException);
  });

  it('update rejects when notification not found', async () => {
    service.getNotificationById.mockResolvedValue(null);
    await expect(controller.update('1', {} as any, makeReq())).rejects.toThrow(NotFoundException);
  });

  it('update returns success payload', async () => {
    service.getNotificationById.mockResolvedValue({ id: 1, userId: 1, campId: 10 });
    service.updateNotification.mockResolvedValue({ id: 1, read: true });
    const res = await controller.update('1', { read: true } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, read: true },
      message: 'Notification updated successfully',
    });
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete()).rejects.toThrow(ForbiddenException);
  });
});
