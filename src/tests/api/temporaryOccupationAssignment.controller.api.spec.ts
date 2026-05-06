import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TemporaryOccupationAssignmentController } from '../../modules/temporaryOccupationAssignment/temporaryOccupationAssignment.controller';

describe('TemporaryOccupationAssignmentController (API controller unit tests)', () => {
  let service: any;
  let controller: TemporaryOccupationAssignmentController;

  beforeEach(() => {
    service = {
      createAssignment: jest.fn(),
      getAssignmentById: jest.fn(),
      getAllAssignments: jest.fn(),
      updateAssignment: jest.fn(),
      deleteAssignment: jest.fn(),
    };
    controller = new TemporaryOccupationAssignmentController(service);
  });

  it('create returns success payload', async () => {
    service.createAssignment.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Temporary occupation assignment created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('')).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when not found', async () => {
    service.getAssignmentById.mockResolvedValue(null);
    await expect(controller.getById('1')).rejects.toThrow(NotFoundException);
  });

  it('getAll rejects invalid personId', async () => {
    await expect(controller.getAll('x')).rejects.toThrow(BadRequestException);
  });

  it('getAll returns pagination data', async () => {
    service.getAllAssignments.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, undefined, '1', '5');
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('update rejects when not found', async () => {
    service.updateAssignment.mockResolvedValue(null);
    await expect(controller.update('1', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('update returns success payload', async () => {
    service.updateAssignment.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', {} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Temporary occupation assignment updated successfully',
    });
  });

  it('delete rejects invalid id', async () => {
    await expect(controller.delete('')).rejects.toThrow(BadRequestException);
  });

  it('delete rejects when not found', async () => {
    service.deleteAssignment.mockResolvedValue(false);
    await expect(controller.delete('1')).rejects.toThrow(BadRequestException);
  });

  it('delete returns success payload', async () => {
    service.deleteAssignment.mockResolvedValue(true);
    await expect(controller.delete('1')).resolves.toEqual({
      success: true,
      message: 'Temporary occupation assignment deleted successfully',
    });
  });
});
