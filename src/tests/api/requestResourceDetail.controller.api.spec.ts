import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestResourceDetailController } from '../../modules/requestResourceDetail/requestResourceDetail.controller';

describe('RequestResourceDetailController (API controller unit tests)', () => {
  let service: any;
  let controller: RequestResourceDetailController;

  const makeReq = (userId = 1, campId = 10) =>
    ({ user: { userId, campId, rol: 'SYSTEM_ADMIN' } }) as any;

  beforeEach(() => {
    service = {
      getRequestScope: jest.fn(),
      getDetailScope: jest.fn(),
      createDetail: jest.fn(),
      getDetailById: jest.fn(),
      getAllDetails: jest.fn(),
      updateDetail: jest.fn(),
      deleteDetail: jest.fn(),
    };
    controller = new RequestResourceDetailController(service);
  });

  it('create returns success payload', async () => {
    service.getRequestScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.createDetail.mockResolvedValue({ id: 1, requestId: 5 });
    const res = await controller.create({ requestId: 5 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, requestId: 5 },
      message: 'Request resource detail created successfully',
    });
  });

  it('create rejects when camp not involved', async () => {
    service.getRequestScope.mockResolvedValue({ originCampId: 2, destinationCampId: 3 });
    await expect(controller.create({ requestId: 5 } as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getById rejects when scope not found', async () => {
    service.getDetailScope.mockResolvedValue(null);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById returns data when allowed', async () => {
    service.getDetailScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.getDetailById.mockResolvedValue({ id: 1 });
    await expect(controller.getById('1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it('getAll rejects invalid requestId', async () => {
    await expect(
      controller.getAll('x', undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getRequestScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.getAllDetails.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll('5', undefined, '1', '10', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 10, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.getDetailScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.getRequestScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.updateDetail.mockResolvedValue({ id: 1, requestId: 5 });
    const res = await controller.update('1', { requestId: 5 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, requestId: 5 },
      message: 'Request resource detail updated successfully',
    });
  });

  it('delete returns success payload', async () => {
    service.getDetailScope.mockResolvedValue({ originCampId: 10, destinationCampId: 20 });
    service.deleteDetail.mockResolvedValue(true);
    await expect(controller.delete('1', makeReq())).resolves.toEqual({
      success: true,
      message: 'Request resource detail deleted successfully',
    });
  });
});
