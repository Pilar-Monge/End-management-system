import { AchievementService } from './achievement.service';

describe('AchievementService', () => {
  const repository = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: AchievementService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AchievementService(repository as never);
  });

  it('createAchievement throws when name already exists', async () => {
    repository.findByName.mockResolvedValue({ id: 1, name: 'Hero' });

    await expect(service.createAchievement({ name: 'Hero' } as never)).rejects.toThrow(
      'An achievement with this name already exists',
    );
  });

  it('createAchievement creates when name is free', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 1, name: 'Hero' });

    await expect(service.createAchievement({ name: 'Hero' } as never)).resolves.toEqual({
      id: 1,
      name: 'Hero',
    });
  });

  it('getAchievementById delegates to repository', async () => {
    repository.findById.mockResolvedValue({ id: 4, name: 'Scout' });

    await expect(service.getAchievementById(4)).resolves.toEqual({ id: 4, name: 'Scout' });
  });

  it('getAllAchievements applies default pagination', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

    await service.getAllAchievements();

    expect(repository.findAllAndCount).toHaveBeenCalledWith({ offset: 0, limit: 10 });
  });

  it('getAllAchievements applies name and custom pagination filters', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

    await service.getAllAchievements({ name: 'med', page: 3, limit: 4 });

    expect(repository.findAllAndCount).toHaveBeenCalledWith({
      name: 'med',
      offset: 8,
      limit: 4,
    });
  });

  it('updateAchievement throws for duplicated name', async () => {
    repository.findByName.mockResolvedValue({ id: 99, name: 'Duplicated' });

    await expect(service.updateAchievement(1, { name: 'Duplicated' })).rejects.toThrow(
      'An achievement with this name already exists',
    );
  });

  it('updateAchievement delegates when valid', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.update.mockResolvedValue({ id: 1, name: 'Updated' });

    await expect(service.updateAchievement(1, { name: 'Updated' })).resolves.toEqual({
      id: 1,
      name: 'Updated',
    });
  });

  it('deleteAchievement delegates to repository', async () => {
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteAchievement(1)).resolves.toBe(true);
  });
});
