import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestPersonDetailController } from '../../modules/requestPersonDetail/requestPersonDetail.controller';

describe('RequestPersonDetailController (API controller unit tests)', () => {
  let service: any;
  let controller: RequestPersonDetailController;

  beforeEach(() => {
    service = {
      createDetail: jest.fn(),
      getDetailById: jest.fn(),
      getAllDetails: jest.fn(),
      updateDetail: jest.fn(),
      deleteDetail: jest.fn(),
    };
    controller = new RequestPersonDetailController(service);
  });

  it('create returns success payload', async () => {
    service.createDetail.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
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
    await expect(controller.getById('1')).rejects.toThrow(NotFoundException);
  });

  it('getAll rejects invalid requestId', async () => {
    await expect(controller.getAll('x')).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllDetails.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll('1', undefined, undefined, undefined, undefined, '1', '5');
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update returns success payload', async () => {
    service.updateDetail.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', {} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Request person detail updated successfully',
    });
  });

  it('delete returns success payload', async () => {
    service.deleteDetail.mockResolvedValue(true);
    await expect(controller.delete('1')).resolves.toEqual({
      success: true,
      message: 'Request person detail deleted successfully',
    });
  });
});
