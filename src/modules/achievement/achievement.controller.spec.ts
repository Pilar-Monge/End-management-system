import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AchievementController } from './achievement.controller';

describe('AchievementController', () => {
  const service = {
    createAchievement: jest.fn(),
    getAchievementById: jest.fn(),
    getAllAchievements: jest.fn(),
    updateAchievement: jest.fn(),
    deleteAchievement: jest.fn(),
  };

  let controller: AchievementController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AchievementController(service as never);
  });

  it('create wraps success response', async () => {
    service.createAchievement.mockResolvedValue({ id: 1, name: 'Hero' });

    await expect(controller.create({ name: 'Hero' } as never)).resolves.toEqual({
      success: true,
      data: { id: 1, name: 'Hero' },
      message: 'Achievement created successfully',
    });
  });

  it('create wraps service errors as BadRequestException', async () => {
    service.createAchievement.mockRejectedValue(new Error('dup'));

    await expect(controller.create({ name: 'Hero' } as never)).rejects.toThrow(BadRequestException);
  });

  it('getById validates invalid id and not found', async () => {
    await expect(controller.getById('x')).rejects.toThrow(BadRequestException);

    service.getAchievementById.mockResolvedValue(null);
    await expect(controller.getById('2')).rejects.toThrow(NotFoundException);
  });

  it('getById returns found achievement', async () => {
    service.getAchievementById.mockResolvedValue({ id: 2, name: 'Scout' });

    await expect(controller.getById('2')).resolves.toEqual({
      success: true,
      data: { id: 2, name: 'Scout' },
    });
  });

  it('getAll validates bad page and bad limit', async () => {
    await expect(controller.getAll(undefined, '0', undefined)).rejects.toThrow(BadRequestException);
    await expect(controller.getAll(undefined, undefined, '0')).rejects.toThrow(BadRequestException);
  });

  it('getAll returns paginated data', async () => {
    service.getAllAchievements.mockResolvedValue({ data: [{ id: 1 }], total: 4 });

    await expect(controller.getAll('h', '2', '3')).resolves.toEqual({
      success: true,
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        limit: 3,
        total: 4,
        pages: 2,
      },
    });

    expect(service.getAllAchievements).toHaveBeenCalledWith({ name: 'h', page: 2, limit: 3 });
  });

  it('update validates id and returns not found when service returns null', async () => {
    await expect(controller.update('a', { name: 'x' })).rejects.toThrow(BadRequestException);

    service.updateAchievement.mockResolvedValue(null);
    await expect(controller.update('9', { name: 'x' })).rejects.toThrow(BadRequestException);
  });

  it('update returns success payload', async () => {
    service.updateAchievement.mockResolvedValue({ id: 1, name: 'Updated' });

    await expect(controller.update('1', { name: 'Updated' })).resolves.toEqual({
      success: true,
      data: { id: 1, name: 'Updated' },
      message: 'Achievement updated successfully',
    });
  });

  it('delete validates id and returns success when deleted', async () => {
    await expect(controller.delete('x')).rejects.toThrow(BadRequestException);

    service.deleteAchievement.mockResolvedValue(true);
    await expect(controller.delete('1')).resolves.toEqual({
      success: true,
      message: 'Achievement deleted successfully',
    });
  });

  it('delete wraps not-found as BadRequestException', async () => {
    service.deleteAchievement.mockResolvedValue(false);

    await expect(controller.delete('1')).rejects.toThrow(BadRequestException);
  });
});
