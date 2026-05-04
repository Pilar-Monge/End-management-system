import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

import { ResourceTypeController } from './resourceType.controller';

describe('ResourceTypeController', () => {
  const service = {
    getResourceTypeById: jest.fn(),
    getAllResourceTypes: jest.fn(),
  };

  let controller: ResourceTypeController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ResourceTypeController(service as never);
  });

  it('create always throws ForbiddenException', async () => {
    await expect(controller.create({ name: 'Water' } as never)).rejects.toThrow(ForbiddenException);
  });

  it('getById validates id and not-found behavior', async () => {
    await expect(controller.getById('invalid')).rejects.toThrow(BadRequestException);

    service.getResourceTypeById.mockResolvedValue(null);
    await expect(controller.getById('1')).rejects.toThrow(NotFoundException);
  });

  it('getById returns success payload when found', async () => {
    service.getResourceTypeById.mockResolvedValue({ id: 1, name: 'Water' });

    await expect(controller.getById('1')).resolves.toEqual({
      success: true,
      data: { id: 1, name: 'Water' },
    });
  });

  it('getAll validates pagination inputs', async () => {
    await expect(controller.getAll(undefined, '0', undefined)).rejects.toThrow(BadRequestException);
    await expect(controller.getAll(undefined, undefined, '0')).rejects.toThrow(BadRequestException);
  });

  it('getAll returns paginated response', async () => {
    service.getAllResourceTypes.mockResolvedValue({ data: [{ id: 1 }], total: 3 });

    await expect(controller.getAll('FOOD' as never, '2', '2')).resolves.toEqual({
      success: true,
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        limit: 2,
        total: 3,
        pages: 2,
      },
    });

    expect(service.getAllResourceTypes).toHaveBeenCalledWith({
      category: 'FOOD',
      page: 2,
      limit: 2,
    });
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
