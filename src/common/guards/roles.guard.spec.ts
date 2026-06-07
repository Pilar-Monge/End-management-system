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
    jest.resetAllMocks();
    guard = new RolesGuard(reflector);
  });

  it('allows when route is marked as public', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(true) // isPublic = true
      .mockReturnValueOnce(undefined); // roles (never reached)

    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it('throws when route has no roles metadata and is not public', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false) // isPublic = false
      .mockReturnValueOnce(false) // authenticatedOnly = false
      .mockReturnValueOnce(undefined); // roles = undefined

    expect(() => guard.canActivate(makeContext('SYSTEM_ADMIN'))).toThrow(ForbiddenException);
  });

  it('throws when roles is empty array', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([]);

    expect(() => guard.canActivate(makeContext('SYSTEM_ADMIN'))).toThrow(ForbiddenException);
  });

  it('allows authenticated-only routes without role metadata', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

    expect(guard.canActivate(makeContext('WORKER'))).toBe(true);
  });

  it('throws when user role is missing', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['SYSTEM_ADMIN']);

    expect(() => guard.canActivate(makeContext())).toThrow(ForbiddenException);
  });

  it('throws when user role is not allowed', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['SYSTEM_ADMIN']);

    expect(() => guard.canActivate(makeContext('WORKER'))).toThrow(ForbiddenException);
  });

  it('allows when user role is included in allowed roles', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['SYSTEM_ADMIN', 'WORKER']);

    expect(guard.canActivate(makeContext('WORKER'))).toBe(true);
  });

  it('throws when user object exists but role is missing', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['SYSTEM_ADMIN']);

    const contextWithUserNoRole = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: {} }),
      }),
    } as never;

    expect(() => guard.canActivate(contextWithUserNoRole)).toThrow(ForbiddenException);
  });
});
