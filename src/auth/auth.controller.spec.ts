import { BadRequestException } from '@nestjs/common';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const service = {
    login: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(service as never);
  });

  it('login delegates to service and wraps success payload', async () => {
    service.login.mockResolvedValue({ token: 'abc' });

    await expect(
      controller.login(
        { username: 'u', password: 'p', campId: 1 } as never,
        { ip: '1.1.1.1' } as never,
      ),
    ).resolves.toEqual({
      success: true,
      data: { token: 'abc' },
    });

    expect(service.login).toHaveBeenCalledWith(
      { username: 'u', password: 'p', campId: 1 },
      '1.1.1.1',
    );
  });

  it('logout throws when authorization header is missing', async () => {
    await expect(controller.logout({ headers: {} } as never)).rejects.toThrow(BadRequestException);
  });

  it('logout throws when token is empty after bearer prefix', async () => {
    await expect(
      controller.logout({ headers: { authorization: 'Bearer    ' } } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('logout uses refreshedToken over bearer token', async () => {
    await expect(
      controller.logout({
        headers: { authorization: 'Bearer from-header' },
        refreshedToken: 'from-refresh',
        ip: '2.2.2.2',
      } as never),
    ).resolves.toEqual({
      success: true,
      message: 'Logged out successfully',
    });

    expect(service.logout).toHaveBeenCalledWith('from-refresh', '2.2.2.2');
  });

  it('checkSession returns active status payload', async () => {
    await expect(controller.checkSession()).resolves.toEqual({
      success: true,
      data: {
        active: true,
      },
    });
  });

  it('forgotPassword always returns generic success message', async () => {
    await expect(
      controller.forgotPassword(
        { email: 'a@a.com', campId: 4 } as never,
        { ip: '3.3.3.3' } as never,
      ),
    ).resolves.toEqual({
      success: true,
      message:
        'Si el correo pertenece a un usuario registrado, recibiras instrucciones para restablecer la contrasena.',
    });

    expect(service.forgotPassword).toHaveBeenCalledWith('a@a.com', 4, '3.3.3.3');
  });

  it('resetPassword returns success message', async () => {
    await expect(
      controller.resetPassword(
        {
          email: 'a@a.com',
          campId: 4,
          code: '12345678',
          newPassword: 'Abc12345!',
        } as never,
        { ip: '4.4.4.4' } as never,
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Contrasena actualizada correctamente',
    });

    expect(service.resetPassword).toHaveBeenCalledWith(
      'a@a.com',
      4,
      '12345678',
      'Abc12345!',
      '4.4.4.4',
    );
  });
});
