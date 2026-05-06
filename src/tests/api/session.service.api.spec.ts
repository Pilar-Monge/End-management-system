import { SessionService } from '../../modules/session/session.service';
import { CampEntity } from '../../modules/camp/camp.entity';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('SessionService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let userRepo: any;
  let campRepo: any;
  let service: SessionService;

  beforeEach(() => {
    repository = {
      findByToken: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userRepo = { findOne: jest.fn(), exist: jest.fn() };
    campRepo = { exist: jest.fn(), findOne: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === UserEntity) return userRepo;
        if (entity === CampEntity) return campRepo;
        return { exist: jest.fn(), findOne: jest.fn() };
      }),
    };

    service = new SessionService(repository, dataSource as any);
  });

  it('createSession throws when user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(
      service.createSession({ userId: 1, campId: 1, token: 't' } as any),
    ).rejects.toThrow('User not found');
  });

  it('createSession throws when camp not found', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, campId: 1 });
    campRepo.exist.mockResolvedValue(false);
    await expect(
      service.createSession({ userId: 1, campId: 1, token: 't' } as any),
    ).rejects.toThrow('Camp not found');
  });

  it('createSession throws when user camp mismatch', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, campId: 2 });
    campRepo.exist.mockResolvedValue(true);
    await expect(
      service.createSession({ userId: 1, campId: 1, token: 't' } as any),
    ).rejects.toThrow('User does not belong to the provided camp');
  });

  it('createSession throws when token exists', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, campId: 1 });
    campRepo.exist.mockResolvedValue(true);
    repository.findByToken.mockResolvedValue({ id: 9 });
    await expect(
      service.createSession({ userId: 1, campId: 1, token: 't' } as any),
    ).rejects.toThrow('A session with this token already exists');
  });

  it('createSession returns created session', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, campId: 1 });
    campRepo.exist.mockResolvedValue(true);
    repository.findByToken.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 1 });
    await expect(
      service.createSession({ userId: 1, campId: 1, token: 't' } as any),
    ).resolves.toEqual({ id: 1 });
  });

  it('getAllSessions forwards filters with offset', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
    await service.getAllSessions({ userId: 2, page: 2, limit: 5 });
    expect(repository.findAllAndCount).toHaveBeenCalledWith({ userId: 2, offset: 5, limit: 5 });
  });

  it('updateSession validates user and camp', async () => {
    userRepo.exist.mockResolvedValue(true);
    campRepo.exist.mockResolvedValue(true);
    repository.update.mockResolvedValue({ id: 1 });
    await expect(service.updateSession(1, { userId: 1, campId: 1 } as any)).resolves.toEqual({
      id: 1,
    });
  });

  it('updateSession throws when user missing', async () => {
    userRepo.exist.mockResolvedValue(false);
    await expect(service.updateSession(1, { userId: 1 } as any)).rejects.toThrow('User not found');
  });

  it('deleteSession returns repository result', async () => {
    repository.delete.mockResolvedValue(true);
    await expect(service.deleteSession(1)).resolves.toBe(true);
  });
});
