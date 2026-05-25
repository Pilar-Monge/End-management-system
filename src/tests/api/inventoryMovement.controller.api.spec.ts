import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InventoryMovementController } from '../../modules/inventoryMovement/inventoryMovement.controller';

describe('InventoryMovementController (API controller unit tests)', () => {
  let service: any;
  let controller: InventoryMovementController;

  const makeReq = (userId = 1, campId = 10, rol = 'WORKER') =>
    ({ user: { userId, campId, rol } }) as any;

  beforeEach(() => {
    service = {
      createMovement: jest.fn(),
      getMovementById: jest.fn(),
      getAllMovements: jest.fn(),
      updateMovement: jest.fn(),
    };
    controller = new InventoryMovementController(service);
  });

  it('create returns success payload', async () => {
    service.createMovement.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.create({ campId: 10, recordedBy: 1 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Inventory movement created successfully',
    });
  });

  it('create rejects recordedBy mismatch', async () => {
    await expect(
      controller.create({ campId: 10, recordedBy: 2 } as any, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getMovementById.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById rejects camp mismatch for non-admin', async () => {
    service.getMovementById.mockResolvedValue({ id: 1, campId: 99 });
    await expect(controller.getById('1', makeReq(1, 10, 'WORKER'))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getAll rejects missing request context', async () => {
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

  it('getAll rejects recordedBy mismatch for non-admin', async () => {
    await expect(
      controller.getAll(
        undefined,
        undefined,
        undefined,
        '2',
        undefined,
        undefined,
        makeReq(1, 10, 'WORKER'),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data for admin', async () => {
    service.getAllMovements.mockResolvedValue({ data: [], total: 0 });
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

  it('update returns success payload', async () => {
    service.getMovementById.mockResolvedValue({ id: 1, campId: 10 });
    service.updateMovement.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.update(
      '1',
      { recordedBy: 1 } as any,
      makeReq(1, 10, 'RESOURCE_MANAGEMENT'),
    );
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Inventory movement updated successfully',
    });
  });

  it('delete always throws forbidden', async () => {
    await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
  });
});
