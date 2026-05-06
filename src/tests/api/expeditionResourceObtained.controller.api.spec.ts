import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExpeditionResourceObtainedController } from '../../modules/expeditionResourceObtained/expeditionResourceObtained.controller';

describe('ExpeditionResourceObtainedController (API controller unit tests)', () => {
  let service: any;
  let controller: ExpeditionResourceObtainedController;

  const makeReq = (userId = 1, campId = 10, rol = 'RESOURCE_MANAGEMENT') =>
    ({ user: { userId, campId, rol } } as any);

  beforeEach(() => {
    service = {
      createRecord: jest.fn(),
      getRecordById: jest.fn(),
      getAllRecords: jest.fn(),
      updateRecord: jest.fn(),
    };
    controller = new ExpeditionResourceObtainedController(service);
  });

  it('create rejects recordedBy mismatch for non-admin', async () => {
    await expect(controller.create({ recordedBy: 2 } as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('create returns success payload', async () => {
    service.createRecord.mockResolvedValue({ id: 1, recordedBy: 1 });
    const res = await controller.create({ recordedBy: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, recordedBy: 1 },
      message: 'Expedition obtained resource recorded successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('x', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getRecordById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById rejects when recordedBy mismatch for non-admin', async () => {
    service.getRecordById.mockResolvedValue({ id: 1, recordedBy: 2 });
    await expect(controller.getById('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects missing request context', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects recordedBy mismatch for non-admin', async () => {
    await expect(
      controller.getAll(undefined, undefined, '2', undefined, undefined, makeReq(1, 10, 'RESOURCE_MANAGEMENT')),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllRecords.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, undefined, '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('x', {} as any, makeReq())).rejects.toThrow(BadRequestException);
  });

  it('update rejects when not found', async () => {
    service.getRecordById.mockResolvedValue(null);
    await expect(controller.update('1', {} as any, makeReq())).rejects.toThrow(NotFoundException);
  });

  it('update rejects recordedBy mismatch for non-admin', async () => {
    service.getRecordById.mockResolvedValue({ id: 1, recordedBy: 2 });
    await expect(controller.update('1', {} as any, makeReq())).rejects.toThrow(BadRequestException);
  });

  it('update returns success payload', async () => {
    service.getRecordById.mockResolvedValue({ id: 1, recordedBy: 1 });
    service.updateRecord.mockResolvedValue({ id: 1, recordedBy: 1 });
    const res = await controller.update('1', { recordedBy: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, recordedBy: 1 },
      message: 'Record updated successfully',
    });
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
  });
});
