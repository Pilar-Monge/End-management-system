import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SessionController } from '../../modules/session/session.controller';

describe('SessionController (API controller unit tests)', () => {
  let service: any;
  let controller: SessionController;

  const makeReq = (userId = 1, campId = 10) =>
    ({ user: { userId, campId, rol: 'SYSTEM_ADMIN' } }) as any;

  beforeEach(() => {
    service = {
      createSession: jest.fn(),
      getSessionById: jest.fn(),
      getAllSessions: jest.fn(),
      updateSession: jest.fn(),
      deleteSession: jest.fn(),
    };
    controller = new SessionController(service);
  });

  it('create returns success payload', async () => {
    service.createSession.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.create({ campId: 10 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Session created successfully',
    });
  });

  it('create rejects camp mismatch', async () => {
    await expect(controller.create({ campId: 99 } as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getSessionById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getAll rejects invalid page', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, '0', undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllSessions.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, undefined, '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.getSessionById.mockResolvedValue({ id: 1, campId: 10 });
    service.updateSession.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.update('1', { campId: 10 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Session updated successfully',
    });
  });

  it('delete returns success payload', async () => {
    service.getSessionById.mockResolvedValue({ id: 1, campId: 10 });
    service.deleteSession.mockResolvedValue(true);
    await expect(controller.delete('1', makeReq())).resolves.toEqual({
      success: true,
      message: 'Session deleted successfully',
    });
  });
});
