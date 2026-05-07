import { assertEntityExists } from './assert-exists';

describe('assertEntityExists', () => {
  it('resolves when repository.exist returns true', async () => {
    const repo = { exist: jest.fn().mockResolvedValue(true) } as any;
    const dataSource = { getRepository: jest.fn().mockReturnValue(repo) } as any;

    await expect(
      assertEntityExists(dataSource, 'Entity' as any, 1, 'Entity'),
    ).resolves.toBeUndefined();

    expect(dataSource.getRepository).toHaveBeenCalledWith('Entity');
    expect(repo.exist).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('throws when repository.exist returns false', async () => {
    const repo = { exist: jest.fn().mockResolvedValue(false) } as any;
    const dataSource = { getRepository: jest.fn().mockReturnValue(repo) } as any;

    await expect(assertEntityExists(dataSource, 'Entity' as any, 2, 'MyLabel')).rejects.toThrow(
      'MyLabel not found',
    );

    expect(dataSource.getRepository).toHaveBeenCalledWith('Entity');
    expect(repo.exist).toHaveBeenCalledWith({ where: { id: 2 } });
  });
});
