import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  let guard: RolesGuard;

  const makeContext = (rol?: string) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: rol ? { rol } : undefined }),
      }),
    }) as never;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector);
  });

  it('allows when route has no roles metadata', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    expect(guard.canActivate(makeContext('SYSTEM_ADMIN'))).toBe(true);
  });

  it('throws when user role is missing', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['SYSTEM_ADMIN']);

    expect(() => guard.canActivate(makeContext())).toThrow(ForbiddenException);
  });

  it('throws when user role is not allowed', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['SYSTEM_ADMIN']);

    expect(() => guard.canActivate(makeContext('WORKER'))).toThrow(ForbiddenException);
  });

  it('allows when user role is included', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['SYSTEM_ADMIN', 'WORKER']);

    expect(guard.canActivate(makeContext('WORKER'))).toBe(true);
  });
});