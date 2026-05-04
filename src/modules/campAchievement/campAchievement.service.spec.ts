import { CampAchievementService } from './campAchievement.service';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('CampAchievementService', () => {
  let service: CampAchievementService;
  let repository: any;
  let dataSource: any;
  let notificationService: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByKey: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAchievementById: jest.fn(),
    };
    dataSource = {};
    notificationService = {
      notifyCampRoles: jest.fn(),
      notifyUser: jest.fn(),
    };
    service = new CampAchievementService(
      repository as never,
      dataSource as never,
      notificationService as never,
    );
  });

  describe('createCampAchievement', () => {
    it('should create and notify', async () => {
      const dto = { campId: 1, achievementId: 1, unlockedBy: 1 };
      repository.findByKey.mockResolvedValue(null);
      repository.create.mockResolvedValue(dto);
      repository.findAchievementById.mockResolvedValue({ id: 1, name: 'First Achievement' });

      const result = await service.createCampAchievement(dto as any);
      expect(result).toEqual(dto);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUser).toHaveBeenCalled();
    });

    it('should throw if already exists', async () => {
      repository.findByKey.mockResolvedValue({ id: 1 });
      await expect(
        service.createCampAchievement({ campId: 1, achievementId: 1 } as any),
      ).rejects.toThrow('Este logro de campamento ya existe');
    });
  });

  describe('updateCampAchievement', () => {
    it('should update and notify', async () => {
      const updated = { campId: 1, achievementId: 1, unlockedBy: 1 };
      repository.update.mockResolvedValue(updated);
      repository.findAchievementById.mockResolvedValue({ name: 'Logro' });

      const result = await service.updateCampAchievement(1, 1, { unlockedBy: 2 });
      expect(result).toEqual(updated);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  describe('deleteCampAchievement', () => {
    it('should delete and notify', async () => {
      const existing = { campId: 1, achievementId: 1, unlockedBy: 1 };
      repository.findByKey.mockResolvedValue(existing);
      repository.delete.mockResolvedValue(true);
      repository.findAchievementById.mockResolvedValue({ name: 'Logro' });

      const result = await service.deleteCampAchievement(1, 1);
      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
