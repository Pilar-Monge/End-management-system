import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OccupationController } from '../../modules/occupation/occupation.controller';

describe('OccupationController (API controller unit tests)', () => {
  let service: any;
  let controller: OccupationController;

  beforeEach(() => {
    service = {
      createOccupation: jest.fn(),
      getOccupationById: jest.fn(),
      getAllOccupations: jest.fn(),
      updateOccupation: jest.fn(),
      deleteOccupation: jest.fn(),
    };
    controller = new OccupationController(service);
  });

  it('create returns success payload', async () => {
    service.createOccupation.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Occupation created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('')).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getOccupationById.mockResolvedValue(null);
    await expect(controller.getById('1')).rejects.toThrow(NotFoundException);
  });

  it('getById returns data when found', async () => {
    service.getOccupationById.mockResolvedValue({ id: 1 });
    await expect(controller.getById('1')).resolves.toEqual({ success: true, data: { id: 1 } });
  });

  it('getAll rejects invalid collectsResources', async () => {
    await expect(controller.getAll('maybe')).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllOccupations.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, undefined, '1', '5');
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('update rejects when not found', async () => {
    service.updateOccupation.mockResolvedValue(null);
    await expect(controller.update('1', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('update returns success payload', async () => {
    service.updateOccupation.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', {} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Occupation updated successfully',
    });
  });

  it('delete rejects invalid id', async () => {
    await expect(controller.delete('')).rejects.toThrow(BadRequestException);
  });

  it('delete rejects when not found', async () => {
    service.deleteOccupation.mockResolvedValue(false);
    await expect(controller.delete('1')).rejects.toThrow(BadRequestException);
  });

  it('delete returns success payload', async () => {
    service.deleteOccupation.mockResolvedValue(true);
    await expect(controller.delete('1')).resolves.toEqual({
      success: true,
      message: 'Occupation deleted successfully',
    });
  });
});
