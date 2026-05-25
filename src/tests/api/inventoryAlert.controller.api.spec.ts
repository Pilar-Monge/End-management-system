import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InventoryAlertController } from '../../modules/inventoryAlert/inventoryAlert.controller';

describe('InventoryAlertController (API controller unit tests)', () => {
  let service: any;
  let controller: InventoryAlertController;

  const makeReq = (userId = 1, campId = 10, rol = 'RESOURCE_MANAGEMENT') =>
    ({ user: { userId, campId, rol } }) as any;

  beforeEach(() => {
    service = {
      getAlertById: jest.fn(),
      getAllAlerts: jest.fn(),
      updateAlert: jest.fn(),
    };
    controller = new InventoryAlertController(service);
  });

  it('create always throws forbidden', async () => {
    await expect(controller.create({} as any)).rejects.toThrow(ForbiddenException);
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getAlertById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById rejects camp mismatch for non-admin', async () => {
    service.getAlertById.mockResolvedValue({ id: 1, campId: 99 });
    await expect(controller.getById('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById returns data when allowed', async () => {
    service.getAlertById.mockResolvedValue({ id: 1, campId: 10 });
    await expect(controller.getById('1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1, campId: 10 },
    });
  });

  it('getAll rejects invalid resolved', async () => {
    await expect(
      controller.getAll(undefined, undefined, 'maybe', undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllAlerts.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, 'true', '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.getAlertById.mockResolvedValue({ id: 1, campId: 10 });
    service.updateAlert.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.update('1', {} as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Inventory alert updated successfully',
    });
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
  });
});
