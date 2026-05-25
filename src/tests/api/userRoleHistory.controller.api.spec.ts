import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRoleHistoryController } from '../../modules/userRoleHistory/userRoleHistory.controller';

describe('UserRoleHistoryController (API controller unit tests)', () => {
  let service: any;
  let controller: UserRoleHistoryController;

  const makeReq = (userId = 1, campId = 10) =>
    ({ user: { userId, campId, rol: 'SYSTEM_ADMIN' } }) as any;

  beforeEach(() => {
    service = {
      createEntry: jest.fn(),
      getEntryCampId: jest.fn(),
      getEntryById: jest.fn(),
      getAllEntries: jest.fn(),
      getUserCampId: jest.fn(),
      updateEntry: jest.fn(),
      deleteEntry: jest.fn(),
    };
    controller = new UserRoleHistoryController(service);
  });

  it('create returns success payload', async () => {
    service.createEntry.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'User role history entry created successfully',
    });
  });

  it('getById rejects invalid id', async () => {
    await expect(controller.getById('', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getById rejects camp mismatch', async () => {
    service.getEntryCampId.mockResolvedValue(99);
    await expect(controller.getById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getById returns data when found', async () => {
    service.getEntryCampId.mockResolvedValue(10);
    service.getEntryById.mockResolvedValue({ id: 1 });
    await expect(controller.getById('1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it('getAll rejects missing request context', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects invalid userId', async () => {
    await expect(
      controller.getAll('x', undefined, undefined, undefined, makeReq()),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll returns camp-filtered data', async () => {
    service.getAllEntries.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }], total: 2 });
    service.getEntryCampId.mockResolvedValueOnce(10).mockResolvedValueOnce(99);
    const res = await controller.getAll(undefined, undefined, '1', '5', makeReq());
    expect(res.data).toEqual([{ id: 1 }]);
    expect(res.pagination.total).toBe(1);
  });

  it('update rejects invalid id', async () => {
    await expect(controller.update('', {} as any, makeReq())).rejects.toThrow(BadRequestException);
  });

  it('update rejects camp mismatch', async () => {
    service.getEntryCampId.mockResolvedValue(99);
    await expect(controller.update('1', {} as any, makeReq())).rejects.toThrow(NotFoundException);
  });

  it('update returns success payload', async () => {
    service.getEntryCampId.mockResolvedValue(10);
    service.updateEntry.mockResolvedValue({ id: 1 });
    const res = await controller.update('1', {} as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'User role history entry updated successfully',
    });
  });

  it('delete rejects invalid id', async () => {
    await expect(controller.delete('', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('delete rejects camp mismatch', async () => {
    service.getEntryCampId.mockResolvedValue(99);
    await expect(controller.delete('1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('delete returns success payload', async () => {
    service.getEntryCampId.mockResolvedValue(10);
    service.deleteEntry.mockResolvedValue(true);
    await expect(controller.delete('1', makeReq())).resolves.toEqual({
      success: true,
      message: 'User role history entry deleted successfully',
    });
  });
});
