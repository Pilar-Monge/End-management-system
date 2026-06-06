import { AuthRepository } from './auth.repository';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let sessionRepo: any;
  let accessLogRepo: any;
  let passwordResetTokenRepo: any;

  beforeEach(() => {
    sessionRepo = {
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
      findOne: jest.fn(),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn().mockResolvedValue({ id: 1, sessionInactivityMinutes: 30 }),
        }),
      },
    };
    accessLogRepo = {
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    };
    passwordResetTokenRepo = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
      findOne: jest.fn(),
      increment: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    repository = new AuthRepository(sessionRepo, accessLogRepo, passwordResetTokenRepo);
  });

  it('createSession should call repo save', async () => {
    const data = { token: 't', userId: 1, campId: 10, expirationDate: new Date() };
    const result = await repository.createSession(data);
    expect(result.token).toBe('t');
    expect(sessionRepo.save).toHaveBeenCalled();
  });

  it('findActiveSessionByToken should call findOne', async () => {
    await repository.findActiveSessionByToken('t');
    expect(sessionRepo.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { token: 't', status: 'ACTIVE' } }),
    );
  });

  it('expireSession should call update', async () => {
    await repository.expireSession(1);
    expect(sessionRepo.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({ status: 'EXPIRED' }),
    );
  });

  it('closeSession should call update', async () => {
    await repository.closeSession(1);
    expect(sessionRepo.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({ status: 'CLOSED' }),
    );
  });

  it('updateSessionLastActivity should call update', async () => {
    await repository.updateSessionLastActivity(1);
    expect(sessionRepo.update).toHaveBeenCalledWith({ id: 1 }, expect.any(Object));
  });

  it('replaceActiveSessionToken should call update', async () => {
    await repository.replaceActiveSessionToken('c', 'n', new Date());
    expect(sessionRepo.update).toHaveBeenCalled();
  });

  it('createAccessLog should call accessLogRepo save', async () => {
    await repository.createAccessLog({ userId: 1, campId: 1, eventType: 'LOGIN' as any });
    expect(accessLogRepo.save).toHaveBeenCalled();
  });

  it('findCampSessionInactivityMinutes should return minutes', async () => {
    const result = await repository.findCampSessionInactivityMinutes(1);
    expect(result).toBe(30);
  });

  it('invalidateActivePasswordResetTokens should call update', async () => {
    await repository.invalidateActivePasswordResetTokens(1);
    expect(passwordResetTokenRepo.update).toHaveBeenCalledWith(
      { userId: 1, status: 'ACTIVE' },
      { status: 'EXPIRED' },
    );
  });

  it('createPasswordResetToken should call save', async () => {
    await repository.createPasswordResetToken({
      userId: 1,
      tokenHash: 'h',
      codeHash: 'c',
      expiresAt: new Date(),
    });
    expect(passwordResetTokenRepo.save).toHaveBeenCalled();
  });

  it('findActivePasswordResetTokenByUserId should handle found token', async () => {
    const token = { expiresAt: new Date(Date.now() + 10000) };
    passwordResetTokenRepo.findOne.mockResolvedValue(token);
    const result = await repository.findActivePasswordResetTokenByUserId(1, new Date());
    expect(result).toBe(token);
  });

  it('findActivePasswordResetTokenByUserId should handle expired token', async () => {
    const token = { expiresAt: new Date(Date.now() - 10000), status: 'ACTIVE' };
    passwordResetTokenRepo.findOne.mockResolvedValue(token);
    const result = await repository.findActivePasswordResetTokenByUserId(1, new Date());
    expect(result).toBeNull();
    expect(passwordResetTokenRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'EXPIRED' }),
    );
  });

  it('incrementPasswordResetTokenAttempts should call increment', async () => {
    await repository.incrementPasswordResetTokenAttempts(1);
    expect(passwordResetTokenRepo.increment).toHaveBeenCalledWith({ id: 1 }, 'attempts', 1);
  });

  it('expirePasswordResetToken should call update', async () => {
    await repository.expirePasswordResetToken(1);
    expect(passwordResetTokenRepo.update).toHaveBeenCalledWith({ id: 1 }, { status: 'EXPIRED' });
  });

  it('markPasswordResetTokenUsed should call update', async () => {
    await repository.markPasswordResetTokenUsed(1, new Date());
    expect(passwordResetTokenRepo.update).toHaveBeenCalled();
  });

  it('closeActiveSessionsByUser should call update', async () => {
    await repository.closeActiveSessionsByUser(1, new Date());
    expect(sessionRepo.update).toHaveBeenCalledWith(
      { userId: 1, status: 'ACTIVE' },
      expect.objectContaining({ status: 'CLOSED' }),
    );
  });
});
