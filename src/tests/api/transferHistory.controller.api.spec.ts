import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransferHistoryController } from '../../modules/transferHistory/transferHistory.controller';

describe('TransferHistoryController (API controller unit tests)', () => {
  let service: any;
  let dataSource: any;
  let controller: TransferHistoryController;

  const makeReq = (userId = 1, campId = 10, rol = 'RESOURCE_MANAGEMENT') =>
    ({ user: { userId, campId, rol } }) as any;

  beforeEach(() => {
    service = {
      createEntry: jest.fn(),
      getEntryById: jest.fn(),
      getAllEntries: jest.fn(),
        assertTransferCampAccess: jest.fn().mockResolvedValue(undefined),
        assertHistoryCampAccess: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = { query: jest.fn() };
    controller = new TransferHistoryController(service, dataSource as any);
  });

  it('create rejects userId mismatch for non-admin', async () => {
    await expect(
      controller.create({ transferId: 1, userId: 2 } as any, makeReq(1, 10, 'RESOURCE_MANAGEMENT')),
    ).rejects.toThrow(BadRequestException);
  });

  it('create returns success payload for non-admin with access', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.createEntry.mockResolvedValue({ id: 1 });
    const res = await controller.create(
      { transferId: 1, userId: 1 } as any,
      makeReq(1, 10, 'RESOURCE_MANAGEMENT'),
    );
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Transfer history entry created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('x', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.getEntryById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById rejects when userId mismatch for non-admin', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.getEntryById.mockResolvedValue({ id: 1, userId: 2 });
    await expect(controller.getById('1', makeReq(1, 10, 'RESOURCE_MANAGEMENT'))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getAll rejects invalid transferId', async () => {
    await expect(
      controller.getAll('x', undefined, undefined, undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data for admin', async () => {
    service.getAllEntries.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(
      undefined,
      undefined,
      undefined,
      undefined,
      '1',
      '5',
      makeReq(1, 10, 'SYSTEM_ADMIN'),
    );
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('x')).rejects.toThrow(BadRequestException);
  });

  it('update always throws forbidden for valid id', async () => {
    await expect(controller.update('1')).rejects.toThrow(ForbiddenException);
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
  });
});
