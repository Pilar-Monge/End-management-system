import { BadRequestException } from '@nestjs/common';
import { CampAchievementService } from '../../modules/campAchievement/campAchievement.service';
import { CampEntity } from '../../modules/camp/camp.entity';
import { AchievementEntity } from '../../modules/achievement/achievement.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('CampAchievementService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let campRepo: any;
  let achievementRepo: any;
  let userRepo: any;
  let notificationService: any;
  let service: CampAchievementService;

  beforeEach(() => {
    repository = {
      findByKey: jest.fn(),
      create: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAchievementById: jest.fn(),
    };
    campRepo = { exist: jest.fn().mockResolvedValue(true) };
    achievementRepo = { exist: jest.fn().mockResolvedValue(true) };
    userRepo = { exist: jest.fn().mockResolvedValue(true) };
    notificationService = { notifyCampRoles: jest.fn(), notifyUser: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === CampEntity) return campRepo;
        if (entity === AchievementEntity) return achievementRepo;
        if (entity === UserEntity) return userRepo;
        return { exist: jest.fn() };
      }),
    };

    service = new CampAchievementService(repository, dataSource as any, notificationService);
  });

  it('createCampAchievement creates when valid', async () => {
    const dto = { campId: 1, achievementId: 1, unlockedBy: 1 };
    repository.findByKey.mockResolvedValue(null);
    repository.create.mockResolvedValue(dto);
    repository.findAchievementById.mockResolvedValue({ id: 1, name: 'Test Achievement' });

    const res = await service.createCampAchievement(dto as any);
    expect(res).toEqual(dto);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('getCampAchievementByKey returns achievement', async () => {
    repository.findByKey.mockResolvedValue({ campId: 1, achievementId: 1 });

    const res = await service.getCampAchievementByKey(1, 1);
    expect(res).toEqual({ campId: 1, achievementId: 1 });
  });

  it('getAllCampAchievements returns list', async () => {
    repository.findAllAndCount.mockResolvedValue({
      data: [{ campId: 1, achievementId: 1 }],
      total: 1,
    });

    const res = await service.getAllCampAchievements({ campId: 1 });
    expect(res.data).toHaveLength(1);
    expect(res.total).toBe(1);
  });

  it('updateCampAchievement returns updated', async () => {
    const updated = { campId: 1, achievementId: 1, unlockedBy: 1 };
    repository.update.mockResolvedValue(updated);
    repository.findAchievementById.mockResolvedValue({ id: 1, name: 'Test Achievement' });

    const res = await service.updateCampAchievement(1, 1, { unlockedBy: 1 });
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteCampAchievement returns true when deleted', async () => {
    repository.findByKey.mockResolvedValue({ campId: 1, achievementId: 1, unlockedBy: 1 });
    repository.delete.mockResolvedValue(true);
    repository.findAchievementById.mockResolvedValue({ id: 1, name: 'Test Achievement' });

    const res = await service.deleteCampAchievement(1, 1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteCampAchievement returns false when not found', async () => {
    repository.findByKey.mockResolvedValue(null);

    const res = await service.deleteCampAchievement(1, 1);
    expect(res).toBe(false);
  });
});
