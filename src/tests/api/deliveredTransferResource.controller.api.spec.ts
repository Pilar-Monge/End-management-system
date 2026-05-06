import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeliveredTransferResourceController } from '../../modules/deliveredTransferResource/deliveredTransferResource.controller';

describe('DeliveredTransferResourceController (API controller unit tests)', () => {
  let service: any;
  let dataSource: any;
  let controller: DeliveredTransferResourceController;

  const makeReq = (userId = 1, campId = 10, rol = 'RESOURCE_MANAGEMENT') =>
    ({ user: { userId, campId, rol } } as any);

  beforeEach(() => {
    service = {
      createDeliveredResource: jest.fn(),
      getDeliveredResourceById: jest.fn(),
      getAllDeliveredResources: jest.fn(),
    };
    dataSource = { query: jest.fn() };
    controller = new DeliveredTransferResourceController(service, dataSource as any);
  });

  it('create rejects recordedBy mismatch for non-admin', async () => {
    await expect(
      controller.create({ transferId: 1, recordedBy: 2 } as any, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('create returns success payload for non-admin with access', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.createDeliveredResource.mockResolvedValue({ id: 1, recordedBy: 1 });
    const res = await controller.create({ transferId: 1, recordedBy: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, recordedBy: 1 },
      message: 'Delivered transfer resource created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('x', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.getDeliveredResourceById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById rejects when recordedBy mismatch for non-admin', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.getDeliveredResourceById.mockResolvedValue({ id: 1, recordedBy: 2 });
    await expect(controller.getById('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById returns data for admin', async () => {
    service.getDeliveredResourceById.mockResolvedValue({ id: 1, recordedBy: 2 });
    await expect(controller.getById('1', makeReq(1, 10, 'SYSTEM_ADMIN'))).resolves.toEqual({
      success: true,
      data: { id: 1, recordedBy: 2 },
    });
  });

  it('getAll rejects missing request context', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects when non-admin omits transferId', async () => {
    await expect(controller.getAll(undefined, undefined, undefined, undefined, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getAll returns pagination data for admin', async () => {
    service.getAllDeliveredResources.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, '1', '5', makeReq(1, 10, 'SYSTEM_ADMIN'));
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('getAll filters data for non-admin', async () => {
    dataSource.query.mockResolvedValue([{ origin_camp_id: 10, destination_camp_id: 20 }]);
    service.getAllDeliveredResources.mockResolvedValue({
      data: [{ id: 1, recordedBy: 1 }, { id: 2, recordedBy: 2 }],
      total: 2,
    });
    const res = await controller.getAll('1', undefined, '1', '5', makeReq());
    expect(res.data).toEqual([{ id: 1, recordedBy: 1 }]);
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
