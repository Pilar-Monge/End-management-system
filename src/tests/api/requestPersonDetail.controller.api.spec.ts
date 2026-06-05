import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestPersonDetailController } from '../../modules/requestPersonDetail/requestPersonDetail.controller';

describe('RequestPersonDetailController (API controller unit tests)', () => {
  let service: any;
  let controller: RequestPersonDetailController;
  const req = {
    user: {
      userId: 1,
      campId: 1,
      rol: 'RESOURCE_MANAGEMENT',
    },
  } as any;

  beforeEach(() => {
    service = {
      createDetail: jest.fn(),
      getDetailById: jest.fn(),
      getAllDetails: jest.fn(),
      updateDetail: jest.fn(),
      deleteDetail: jest.fn(),
      getRequestScope: jest.fn(),
      getDetailScope: jest.fn(),
    };
    service.getRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
    service.getDetailScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
    controller = new RequestPersonDetailController(service);
  });

  it('create returns success payload', async () => {
    service.createDetail.mockResolvedValue({ id: 1 });
    const res = await controller.create({ requestId: 1 } as any, req);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Request person detail created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('')).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getDetailById.mockResolvedValue(null);
    await expect(controller.getById('1', req)).rejects.toThrow(NotFoundException);
  });

  it('getAll rejects invalid requestId', async () => {
    await expect(
      controller.getAll('x', undefined, undefined, undefined, undefined, undefined, undefined, req),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllDetails.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(
      '1',
      undefined,
      undefined,
      undefined,
      undefined,
      '1',
      '5',
      req,
    );
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.updateDetail.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', {} as any, req);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Request person detail updated successfully',
    });
  });

  it('delete returns success payload', async () => {
    service.deleteDetail.mockResolvedValue(true);
    await expect(controller.delete('1', req)).resolves.toEqual({
      success: true,
      message: 'Request person detail deleted successfully',
    });
  });
});
