import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { CampController } from './camp.controller';

describe('CampController', () => {
  const service = {
    getCampById: jest.fn(),
    getAllCamps: jest.fn(),
  };

  let controller: CampController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CampController(service as never);
  });

  it('create always throws ForbiddenException', async () => {
    await expect(controller.create({ name: 'X' } as never)).rejects.toThrow(ForbiddenException);
  });

  it('getById validates id format', async () => {
    await expect(
      controller.getById('abc', { user: { userId: 1, campId: 1, rol: 'SYSTEM_ADMIN' } } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('getById denies access for non-admin requesting other camp', async () => {
    await expect(
      controller.getById('2', { user: { userId: 9, campId: 1, rol: 'WORKER' } } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('getById returns camp data for admin', async () => {
    service.getCampById.mockResolvedValue({ id: 3, name: 'Camp 3' });

    await expect(
      controller.getById('3', { user: { userId: 1, campId: 1, rol: 'SYSTEM_ADMIN' } } as never),
    ).resolves.toEqual({ success: true, data: { id: 3, name: 'Camp 3' } });
  });

  it('getAll for non-admin returns only own camp', async () => {
    service.getCampById.mockResolvedValue({ id: 2, name: 'Own' });

    await expect(
      controller.getAll(undefined, undefined, undefined, {
        user: { userId: 2, campId: 2, rol: 'WORKER' },
      } as never),
    ).resolves.toEqual({
      success: true,
      data: [{ id: 2, name: 'Own' }],
      pagination: { page: 1, limit: 1, total: 1, pages: 1 },
    });
  });

  it('getAll for admin returns paginated service response', async () => {
    service.getAllCamps.mockResolvedValue({ data: [{ id: 1 }], total: 11 });

    await expect(
      controller.getAll('ACTIVE' as never, '2', '5', {
        user: { userId: 1, campId: 1, rol: 'SYSTEM_ADMIN' },
      } as never),
    ).resolves.toEqual({
      success: true,
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        limit: 5,
        total: 11,
        pages: 3,
      },
    });

    expect(service.getAllCamps).toHaveBeenCalledWith({ status: 'ACTIVE', page: 2, limit: 5 });
  });

  it('update always throws ForbiddenException', async () => {
    await expect(controller.update('1', { name: 'x' } as never)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('delete always throws ForbiddenException', async () => {
    await expect(controller.delete('1')).rejects.toThrow(ForbiddenException);
  });
});
