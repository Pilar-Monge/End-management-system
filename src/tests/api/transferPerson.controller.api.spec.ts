import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TransferPersonController } from '../../modules/transferPerson/transferPerson.controller';

describe('TransferPersonController (API controller unit tests)', () => {
  let service: any;
  let dataSource: any;
  let controller: TransferPersonController;

  const makeReq = (userId = 1, campId = 10, rol = 'TRAVEL_MANAGER') =>
    ({ user: { userId, campId, rol } }) as any;

  beforeEach(() => {
    service = {
      createTransferPerson: jest.fn(),
      getTransferPersonById: jest.fn(),
      getAllTransferPeople: jest.fn(),
      updateTransferPerson: jest.fn(),
        assertTransferCampAccess: jest.fn().mockResolvedValue(undefined),
        assertTransferPersonCampAccess: jest.fn().mockResolvedValue(undefined),
    };
    dataSource = { query: jest.fn() };
    controller = new TransferPersonController(service, dataSource as any);
  });

  it('create returns success payload for non-admin with access', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.createTransferPerson.mockResolvedValue({ id: 1 });
    const res = await controller.create({ transferId: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Transfer person created successfully',
    });
  });

  it('getAll rejects when non-admin omits transferId', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('x', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById returns data for admin', async () => {
    service.getTransferPersonById.mockResolvedValue({ id: 1 });
    const res = await controller.getById('1', makeReq(1, 10, 'SYSTEM_ADMIN'));
    expect(res).toEqual({ success: true, data: { id: 1 } });
  });

  it('getAll returns pagination data for admin', async () => {
    service.getAllTransferPeople.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(
      undefined,
      undefined,
      undefined,
      '1',
      '5',
      makeReq(1, 10, 'SYSTEM_ADMIN'),
    );
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload for non-admin with access', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.updateTransferPerson.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', { transferId: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Transfer person updated successfully',
    });
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete()).rejects.toThrow(ForbiddenException);
  });
});
