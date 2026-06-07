import { SessionActivityMiddleware } from './session-activity.middleware';

describe('SessionActivityMiddleware', () => {
  const authService = {
    validateSession: jest.fn(),
  };

  let middleware: SessionActivityMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = new SessionActivityMiddleware(authService as never);
  });

  it('skips validation when Authorization header is missing', async () => {
    const req = { headers: {} } as never;
    const next = jest.fn();

    await middleware.use(req, {} as never, next);

    expect(authService.validateSession).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips validation when bearer token is empty', async () => {
    const req = { headers: { authorization: 'Bearer    ' } } as never;
    const next = jest.fn();

    await middleware.use(req, {} as never, next);

    expect(authService.validateSession).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('validates session, maps user data, and calls next', async () => {
    authService.validateSession.mockResolvedValue({ userId: 1, campId: 2, rol: 'WORKER' });

    const req = {
      headers: { authorization: 'Bearer token-xyz' },
      ip: '3.3.3.3',
    } as never;
    const next = jest.fn();

    await middleware.use(req, {} as never, next);

    expect(authService.validateSession).toHaveBeenCalledWith('token-xyz', '3.3.3.3', {
      updateLastActivity: true,
    });
    expect(req.user).toEqual({ userId: 1, campId: 2, rol: 'WORKER' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('falls back to "unknown" IP if req.ip is missing', async () => {
    authService.validateSession.mockResolvedValue({ userId: 1, campId: 2, rol: 'WORKER' });

    const req = {
      headers: { authorization: 'Bearer token-xyz' },
    } as any;
    const next = jest.fn();

    await middleware.use(req, {} as never, next);

    expect(authService.validateSession).toHaveBeenCalledWith('token-xyz', 'unknown', {
      updateLastActivity: true,
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
