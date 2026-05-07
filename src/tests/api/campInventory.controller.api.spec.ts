import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CampInventoryController } from '../../modules/campInventory/campInventory.controller';

describe('CampInventoryController (API controller unit tests)', () => {
  let service: any;
  let controller: CampInventoryController;

  const makeReq = (userId = 1, campId = 10, rol = 'RESOURCE_MANAGEMENT') =>
    ({ user: { userId, campId, rol } }) as any;

  beforeEach(() => {
    service = {
      getItem: jest.fn(),
      getAllItems: jest.fn(),
      updateItem: jest.fn(),
    };
    controller = new CampInventoryController(service);
  });

  it('create always throws forbidden', async () => {
    await expect(controller.create({} as any)).rejects.toThrow(ForbiddenException);
  });

  it('getByKey rejects invalid campId', async () => {
    await expect(controller.getByKey('x', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getByKey rejects camp mismatch for non-admin', async () => {
    await expect(controller.getByKey('99', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getByKey returns data when allowed', async () => {
    service.getItem.mockResolvedValue({ campId: 10, resourceTypeId: 1 });
    const res = await controller.getByKey('10', '1', makeReq());
    expect(res).toEqual({
      success: true,
      data: { campId: 10, resourceTypeId: 1 },
    });
  });

  it('getAll rejects missing request context', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects camp mismatch for non-admin', async () => {
    await expect(
      controller.getAll('99', undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllItems.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.updateItem.mockResolvedValue({ campId: 10, resourceTypeId: 1 });
    const res = await controller.update('10', '1', {} as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { campId: 10, resourceTypeId: 1 },
      message: 'Camp inventory item updated successfully',
    });
  });

  it('update rejects when item not found', async () => {
    service.updateItem.mockResolvedValue(null);
    await expect(controller.update('10', '1', {} as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete('1', '1')).rejects.toThrow(ForbiddenException);
  });
});
