import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { AuthService } from './auth.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const authRepository = {
  findActiveSessionByToken: jest.fn(),
  createSession: jest.fn(),
  createAccessLog: jest.fn(),
  closeSession: jest.fn(),
  expireSession: jest.fn(),
  updateSessionLastActivity: jest.fn(),
  replaceActiveSessionToken: jest.fn(),
  invalidateActivePasswordResetTokens: jest.fn(),
  createPasswordResetToken: jest.fn(),
  findActivePasswordResetTokenByUserId: jest.fn(),
  incrementPasswordResetTokenAttempts: jest.fn(),
  expirePasswordResetToken: jest.fn(),
  markPasswordResetTokenUsed: jest.fn(),
  closeActiveSessionsByUser: jest.fn(),
};

const systemUserRepository = {
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

const systemTimeService = {
  now: jest.fn(),
};

const emailOutboxService = {
  enqueue: jest.fn(),
};

const notificationService = {
  notifyUser: jest.fn(),
};

const NOW = new Date('2026-01-01T12:00:00.000Z');

const ACTIVE_USER = {
  id: 1,
  username: 'testuser',
  passwordHash: bcrypt.hashSync('securepass', 1),
  role: 'WORKER',
  campId: 5,
  status: 'ACTIVE',
  email: 'test@example.com',
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key-32chars-for-testing';
    process.env.PASSWORD_RESET_CODE_SECRET = 'password-reset-code-secret-for-testing';
    systemTimeService.now.mockReturnValue(new Date(NOW));
    service = new AuthService(
      authRepository as never,
      systemUserRepository as never,
      systemTimeService as never,
      emailOutboxService as never,
      notificationService as never,
    );
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.PASSWORD_RESET_CODE_SECRET;
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('throws BadRequestException when credentials are incomplete', async () => {
      await expect(
        service.login({ username: '', password: '', campId: 1 }, '127.0.0.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when campId is not a positive integer', async () => {
      await expect(
        service.login({ username: 'u', password: 'p', campId: 0 }, '127.0.0.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws UnauthorizedException when user is not found', async () => {
      systemUserRepository.findByUsername.mockResolvedValue(null);

      await expect(
        service.login({ username: 'unknown', password: 'pw', campId: 1 }, '127.0.0.1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException and logs failed attempt when user is inactive', async () => {
      systemUserRepository.findByUsername.mockResolvedValue({ ...ACTIVE_USER, status: 'INACTIVE' });
      authRepository.createAccessLog.mockResolvedValue(undefined);

      await expect(
        service.login({ username: 'testuser', password: 'securepass', campId: 5 }, '1.1.1.1'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authRepository.createAccessLog).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: 'FAILED_ATTEMPT' }),
      );
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      systemUserRepository.findByUsername.mockResolvedValue(ACTIVE_USER);
      authRepository.createAccessLog.mockResolvedValue(undefined);

      await expect(
        service.login({ username: 'testuser', password: 'wrong', campId: 5 }, '1.1.1.1'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authRepository.createAccessLog).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: 'FAILED_ATTEMPT', detail: 'Invalid password' }),
      );
    });

    it('returns token and user info on successful login', async () => {
      systemUserRepository.findByUsername.mockResolvedValue(ACTIVE_USER);
      authRepository.createSession.mockResolvedValue({ id: 10 });
      authRepository.createAccessLog.mockResolvedValue(undefined);

      const result = await service.login(
        { username: 'testuser', password: 'securepass', campId: 5 },
        '127.0.0.1',
      );

      expect(result).toMatchObject({
        token: expect.any(String),
        user: {
          id: ACTIVE_USER.id,
          username: ACTIVE_USER.username,
          rol: ACTIVE_USER.role,
          campId: ACTIVE_USER.campId,
        },
      });

      expect(authRepository.createSession).toHaveBeenCalledTimes(1);
      expect(authRepository.createAccessLog).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: 'LOGIN' }),
      );
    });

    it('throws Error when JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;
      systemUserRepository.findByUsername.mockResolvedValue(ACTIVE_USER);

      await expect(
        service.login({ username: 'testuser', password: 'securepass', campId: 5 }, '127.0.0.1'),
      ).rejects.toThrow('JWT_SECRET is not configured');
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('throws BadRequestException when token is empty', async () => {
      await expect(service.logout('', '1.1.1.1')).rejects.toThrow(BadRequestException);
    });

    it('throws UnauthorizedException when session not found', async () => {
      authRepository.findActiveSessionByToken.mockResolvedValue(null);

      await expect(service.logout('bad-token', '1.1.1.1')).rejects.toThrow(UnauthorizedException);
    });

    it('closes session and logs LOGOUT on success', async () => {
      const session = { id: 7, userId: 1, campId: 5 };
      authRepository.findActiveSessionByToken.mockResolvedValue(session);
      authRepository.closeSession.mockResolvedValue(undefined);
      authRepository.createAccessLog.mockResolvedValue(undefined);

      await service.logout('valid-token', '1.2.3.4');

      expect(authRepository.closeSession).toHaveBeenCalledWith(session.id, NOW);
      expect(authRepository.createAccessLog).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: 'LOGOUT' }),
      );
    });
  });

  // ─── decodeAndVerifyToken ──────────────────────────────────────────────────

  describe('decodeAndVerifyToken', () => {
    it('throws UnauthorizedException when token is empty', () => {
      expect(() => service.decodeAndVerifyToken('')).toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET;
      expect(() => service.decodeAndVerifyToken('anything')).toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token is malformed', () => {
      expect(() => service.decodeAndVerifyToken('not.a.valid.token')).toThrow(
        UnauthorizedException,
      );
    });

    it('returns payload for a valid token', () => {
      const token = jwt.sign(
        { userId: 1, campId: 5, rol: 'WORKER', jti: 'abc' },
        process.env.JWT_SECRET!,
        { expiresIn: '20m' },
      );

      const result = service.decodeAndVerifyToken(token);

      expect(result).toMatchObject({ userId: 1, campId: 5, rol: 'WORKER' });
    });

    it('throws UnauthorizedException when payload is missing required fields', () => {
      const badToken = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET!, { expiresIn: '1m' });
      expect(() => service.decodeAndVerifyToken(badToken)).toThrow(UnauthorizedException);
    });
  });

  // ─── validateSession ───────────────────────────────────────────────────────

  describe('validateSession', () => {
    const validToken = () =>
      jwt.sign({ userId: 1, campId: 5, rol: 'WORKER', jti: 'x' }, process.env.JWT_SECRET!, {
        expiresIn: '20m',
      });

    it('throws UnauthorizedException when session is not found', async () => {
      authRepository.findActiveSessionByToken.mockResolvedValue(null);

      await expect(service.validateSession(validToken(), '1.1.1.1')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('expires session and throws when inactive for too long', async () => {
      const oldActivity = new Date(NOW.getTime() - 21 * 60 * 1000);
      authRepository.findActiveSessionByToken.mockResolvedValue({
        id: 3,
        userId: 1,
        campId: 5,
        lastActivityDate: oldActivity,
      });
      authRepository.expireSession.mockResolvedValue(undefined);
      authRepository.createAccessLog.mockResolvedValue(undefined);

      await expect(service.validateSession(validToken(), '1.1.1.1')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authRepository.expireSession).toHaveBeenCalledWith(3, NOW);
      expect(authRepository.createAccessLog).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: 'INACTIVITY_EXPIRATION' }),
      );
    });

    it('returns payload for active session without updating activity', async () => {
      const recentActivity = new Date(NOW.getTime() - 1 * 60 * 1000);
      authRepository.findActiveSessionByToken.mockResolvedValue({
        id: 3,
        userId: 1,
        campId: 5,
        lastActivityDate: recentActivity,
      });

      const payload = await service.validateSession(validToken(), '1.1.1.1');

      expect(payload).toMatchObject({ userId: 1, campId: 5, rol: 'WORKER' });
      expect(authRepository.updateSessionLastActivity).not.toHaveBeenCalled();
    });

    it('updates last activity when option is set', async () => {
      const recentActivity = new Date(NOW.getTime() - 5 * 60 * 1000);
      authRepository.findActiveSessionByToken.mockResolvedValue({
        id: 3,
        userId: 1,
        campId: 5,
        lastActivityDate: recentActivity,
      });
      authRepository.updateSessionLastActivity.mockResolvedValue(undefined);

      await service.validateSession(validToken(), '1.1.1.1', { updateLastActivity: true });

      expect(authRepository.updateSessionLastActivity).toHaveBeenCalledWith(3, NOW);
    });
  });

  // ─── rotateSessionToken ────────────────────────────────────────────────────

  describe('rotateSessionToken', () => {
    it('throws UnauthorizedException when token is empty', async () => {
      await expect(
        service.rotateSessionToken('', { userId: 1, campId: 5, rol: 'WORKER' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when session not found for token', async () => {
      authRepository.replaceActiveSessionToken.mockResolvedValue(null);

      await expect(
        service.rotateSessionToken('old-token', { userId: 1, campId: 5, rol: 'WORKER' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns new token on success', async () => {
      authRepository.replaceActiveSessionToken.mockResolvedValue({ id: 1 });

      const newToken = await service.rotateSessionToken('old-token', {
        userId: 1,
        campId: 5,
        rol: 'WORKER',
      });

      expect(newToken).toBeTruthy();
      expect(typeof newToken).toBe('string');
    });
  });

  // ─── forgotPassword ────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('returns silently when email is empty', async () => {
      await service.forgotPassword('', 1, '1.1.1.1');
      expect(systemUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('returns silently when campId is invalid', async () => {
      await service.forgotPassword('test@test.com', 0, '1.1.1.1');
      expect(systemUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('returns silently when user is not found', async () => {
      systemUserRepository.findByEmail.mockResolvedValue(null);
      await service.forgotPassword('none@test.com', 1, '1.1.1.1');
      expect(authRepository.createPasswordResetToken).not.toHaveBeenCalled();
    });

    it('returns silently when user is inactive', async () => {
      systemUserRepository.findByEmail.mockResolvedValue({ ...ACTIVE_USER, status: 'INACTIVE' });
      await service.forgotPassword('test@example.com', 5, '1.1.1.1');
      expect(authRepository.createPasswordResetToken).not.toHaveBeenCalled();
    });

    it('creates reset code and sends email for active user', async () => {
      systemUserRepository.findByEmail.mockResolvedValue(ACTIVE_USER);
      authRepository.invalidateActivePasswordResetTokens.mockResolvedValue(undefined);
      authRepository.createPasswordResetToken.mockResolvedValue(undefined);
      authRepository.createAccessLog.mockResolvedValue(undefined);
      notificationService.notifyUser.mockResolvedValue(null);
      emailOutboxService.enqueue.mockResolvedValue(undefined);

      await service.forgotPassword('test@example.com', 5, '1.2.3.4');

      expect(authRepository.createPasswordResetToken).toHaveBeenCalledTimes(1);
      expect(authRepository.createPasswordResetToken).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenHash: expect.any(String),
          codeHash: expect.any(String),
          maxAttempts: 5,
        }),
      );
      expect(emailOutboxService.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          templateKey: 'password_reset_request',
          payload: expect.objectContaining({ resetCode: expect.stringMatching(/^\d{8}$/) }),
        }),
      );
    });
  });

  // ─── resetPassword ─────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('throws BadRequestException when email is empty', async () => {
      await expect(
        service.resetPassword('', 5, '12345678', 'newpassword', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when password is shorter than 8 chars', async () => {
      await expect(
        service.resetPassword('test@example.com', 5, '12345678', 'short', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when code is not 8 digits', async () => {
      await expect(
        service.resetPassword('test@example.com', 5, '1234567', 'newpassword123', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when user is not found', async () => {
      systemUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.resetPassword('missing@example.com', 5, '12345678', 'newpassword123', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when active token is missing', async () => {
      systemUserRepository.findByEmail.mockResolvedValue(ACTIVE_USER);
      authRepository.findActivePasswordResetTokenByUserId.mockResolvedValue(null);

      await expect(
        service.resetPassword('test@example.com', 5, '12345678', 'newpassword123', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('increments attempts and expires token when code is invalid at max attempt', async () => {
      systemUserRepository.findByEmail.mockResolvedValue(ACTIVE_USER);
      authRepository.findActivePasswordResetTokenByUserId.mockResolvedValue({
        id: 1,
        userId: ACTIVE_USER.id,
        codeHash: bcrypt.hashSync('different-digest', 1),
        attempts: 4,
        maxAttempts: 5,
      });

      await expect(
        service.resetPassword('test@example.com', 5, '12345678', 'newpassword123', '1.1.1.1'),
      ).rejects.toThrow(BadRequestException);

      expect(authRepository.incrementPasswordResetTokenAttempts).toHaveBeenCalledWith(1);
      expect(authRepository.expirePasswordResetToken).toHaveBeenCalledWith(1);
    });

    it('updates password and sends confirmation email on success', async () => {
      const code = '12345678';
      const digest = createHmac('sha256', 'password-reset-code-secret-for-testing')
        .update(`${ACTIVE_USER.id}:${ACTIVE_USER.campId}:${code}`)
        .digest('hex');

      systemUserRepository.findByEmail.mockResolvedValue(ACTIVE_USER);
      authRepository.findActivePasswordResetTokenByUserId.mockResolvedValue({
        id: 1,
        userId: ACTIVE_USER.id,
        codeHash: bcrypt.hashSync(digest, 1),
        attempts: 0,
        maxAttempts: 5,
      });
      systemUserRepository.update.mockResolvedValue(undefined);
      authRepository.markPasswordResetTokenUsed.mockResolvedValue(undefined);
      authRepository.invalidateActivePasswordResetTokens.mockResolvedValue(undefined);
      authRepository.closeActiveSessionsByUser.mockResolvedValue(undefined);
      authRepository.createAccessLog.mockResolvedValue(undefined);
      notificationService.notifyUser.mockResolvedValue(null);
      emailOutboxService.enqueue.mockResolvedValue(undefined);

      await service.resetPassword('test@example.com', 5, code, 'newpassword123', '1.2.3.4');

      expect(systemUserRepository.update).toHaveBeenCalledWith(
        ACTIVE_USER.id,
        expect.objectContaining({ passwordHash: expect.any(String) }),
      );
      expect(emailOutboxService.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({ templateKey: 'password_reset_confirmation' }),
      );
    });
  });
});
