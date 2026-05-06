import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CampAchievementController } from '../../modules/campAchievement/campAchievement.controller';

describe('CampAchievementController (API controller unit tests)', () => {
  let service: any;
  let controller: CampAchievementController;

  const makeReq = (userId = 1, campId = 10) =>
    ({ user: { userId, campId, rol: 'SYSTEM_ADMIN' } } as any);

  beforeEach(() => {
    service = {
      createCampAchievement: jest.fn(),
      getCampAchievementByKey: jest.fn(),
      getAllCampAchievements: jest.fn(),
      updateCampAchievement: jest.fn(),
      deleteCampAchievement: jest.fn(),
    };
    controller = new CampAchievementController(service);
  });

  it('create returns success payload', async () => {
    service.createCampAchievement.mockResolvedValue({ id: 1, campId: 10 });
    const res = await controller.create({ campId: 10 } as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1, campId: 10 },
      message: 'Camp achievement created successfully',
    });
  });

  it('create rejects camp mismatch', async () => {
    await expect(controller.create({ campId: 99 } as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getByKey rejects invalid ids', async () => {
    await expect(controller.getByKey('x', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getByKey rejects camp mismatch', async () => {
    await expect(controller.getByKey('99', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getByKey rejects when not found', async () => {
    service.getCampAchievementByKey.mockResolvedValue(null);
    await expect(controller.getByKey('10', '1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('getByKey returns data when found', async () => {
    service.getCampAchievementByKey.mockResolvedValue({ id: 1 });
    await expect(controller.getByKey('10', '1', makeReq())).resolves.toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it('getAll rejects missing request context', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll rejects invalid campId', async () => {
    await expect(controller.getAll('x', undefined, undefined, undefined, undefined, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getAll returns pagination data', async () => {
    service.getAllCampAchievements.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.getAll(undefined, undefined, undefined, '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });

  it('update rejects invalid ids', async () => {
    await expect(controller.update('x', '1', {} as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update rejects camp mismatch', async () => {
    await expect(controller.update('99', '1', {} as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update rejects when not found', async () => {
    service.updateCampAchievement.mockResolvedValue(null);
    await expect(controller.update('10', '1', {} as any, makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update returns success payload', async () => {
    service.updateCampAchievement.mockResolvedValue({ id: 1 });
    const res = await controller.update('10', '1', {} as any, makeReq());
    expect(res).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Camp achievement updated successfully',
    });
  });

  it('delete rejects invalid ids', async () => {
    await expect(controller.delete('x', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('delete rejects camp mismatch', async () => {
    await expect(controller.delete('99', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('delete rejects when not found', async () => {
    service.deleteCampAchievement.mockResolvedValue(false);
    await expect(controller.delete('10', '1', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('delete returns success payload', async () => {
    service.deleteCampAchievement.mockResolvedValue(true);
    await expect(controller.delete('10', '1', makeReq())).resolves.toEqual({
      success: true,
      message: 'Camp achievement deleted successfully',
    });
  });
});
