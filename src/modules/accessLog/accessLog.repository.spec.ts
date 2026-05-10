import { AccessLogRepository } from './accessLog.repository';

describe('AccessLogRepository', () => {
  let repository: AccessLogRepository;
  let repo: any;

  beforeEach(() => {
    repo = {
      create: jest.fn().mockImplementation(d => d),
      save: jest.fn().mockImplementation(d => Promise.resolve({ id: 1, ...d })),
      findOne: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue({ id: 1 }),
        }),
      },
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      }),
    };
    repository = new AccessLogRepository(repo);
  });

  it('create should call save', async () => {
    await repository.create({ userId: 1, campId: 1, eventType: 'LOGIN' as any });
    expect(repo.save).toHaveBeenCalled();
  });

  it('findById should call findOne', async () => {
    await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('findUserById should call findOne on user repo', async () => {
    await repository.findUserById(1);
    expect(repo.manager.getRepository).toHaveBeenCalled();
  });

  it('findSessionById should call findOne on session repo', async () => {
    await repository.findSessionById(1);
    expect(repo.manager.getRepository).toHaveBeenCalled();
  });

  it('findAllAndCount should use query builder', async () => {
    await repository.findAllAndCount({ userId: 1, limit: 10 });
    expect(repo.createQueryBuilder).toHaveBeenCalled();
  });

  it('update should call save if exists', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await repository.update(1, { detail: 'new' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('update should return null if not exists', async () => {
    repo.findOne.mockResolvedValue(null);
    const result = await repository.update(1, {});
    expect(result).toBeNull();
  });

  it('delete should call delete', async () => {
    await repository.delete(1);
    expect(repo.delete).toHaveBeenCalled();
  });
});
