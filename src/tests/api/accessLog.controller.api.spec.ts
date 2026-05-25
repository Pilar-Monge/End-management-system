import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccessLogController } from '../../modules/accessLog/accessLog.controller';

describe('AccessLogController (API controller unit tests)', () => {
  let service: any;
  let controller: AccessLogController;

  const makeReq = (userId = 1, campId = 10) =>
    ({ user: { userId, campId, rol: 'SYSTEM_ADMIN' } }) as any;

  beforeEach(() => {
    service = {
      createLog: jest.fn(),
      getLogById: jest.fn(),
      getAllLogs: jest.fn(),
      updateLog: jest.fn(),
      deleteLog: jest.fn(),
    };
    controller = new AccessLogController(service);
  });

  it('create returns success payload', async () => {
    service.createLog.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.create({ campId: 10 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Access log created successfully',
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
    service.getLogById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById returns data when allowed', async () => {
    service.getLogById.mockResolvedValue({ id: 1, campId: 10 });
    await expect(controller.getById('1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1, campId: 10 },
    });
  });

  it('getAll rejects invalid page', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, '0', undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllLogs.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(
      undefined,
      undefined,
      undefined,
      undefined,
      '1',
      '5',
      makeReq(),
    );
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.getLogById.mockResolvedValue({ id: 1, campId: 10 });
    service.updateLog.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.update('1', { campId: 10 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Access log updated successfully',
    });
  });

  it('delete returns success payload', async () => {
    service.getLogById.mockResolvedValue({ id: 1, campId: 10 });
    service.deleteLog.mockResolvedValue(true);
    await expect(controller.delete('1', makeReq())).resolves.toEqual({
      success: true,
      message: 'Access log deleted successfully',
    });
  });
});
