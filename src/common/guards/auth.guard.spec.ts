import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const authService = {
    validateSession: jest.fn(),
    rotateSessionToken: jest.fn(),
  };

  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  let guard: AuthGuard;

  const makeContext = (req: Record<string, unknown>, res: Record<string, unknown> = {}) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    }) as never;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(authService as never, reflector);
  });

  it('allows public routes', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    await expect(guard.canActivate(makeContext({ headers: {} }))).resolves.toBe(true);
  });

  it('throws when authorization header is missing', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    await expect(guard.canActivate(makeContext({ headers: {} }))).rejects.toThrow(UnauthorizedException);
  });

  it('throws when bearer token is empty', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    await expect(
      guard.canActivate(makeContext({ headers: { authorization: 'Bearer   ' } })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('validates session and attaches payload to request', async () => {
    const payload = { userId: 1, campId: 2, rol: 'SYSTEM_ADMIN' };
    authService.validateSession.mockResolvedValue(payload);

    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    const req: Record<string, unknown> = {
      headers: { authorization: 'Bearer token-1' },
      ip: '1.1.1.1',
    };

    await expect(guard.canActivate(makeContext(req))).resolves.toBe(true);
    expect(authService.validateSession).toHaveBeenCalledWith('token-1', '1.1.1.1');
    expect(req.user).toEqual(payload);
  });

  it('rotates session when refreshSession metadata is enabled', async () => {
    const payload = { userId: 3, campId: 4, rol: 'WORKER' };
    authService.validateSession.mockResolvedValue(payload);
    authService.rotateSessionToken.mockResolvedValue('new-token');

    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const req: Record<string, unknown> = {
      headers: { authorization: 'Bearer old-token' },
      ip: '2.2.2.2',
    };
    const res = {
      setHeader: jest.fn(),
    };

    await expect(guard.canActivate(makeContext(req, res))).resolves.toBe(true);

    expect(authService.rotateSessionToken).toHaveBeenCalledWith('old-token', payload);
    expect(res.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer new-token');
    expect(req.refreshedToken).toBe('new-token');
  });
});