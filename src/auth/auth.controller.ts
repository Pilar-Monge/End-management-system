import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { Public } from '../common/decorators';
import { ForgotPasswordDto, ResetPasswordDto } from './dto';
import { AuthService } from './auth.service';
import type { LoginDTO } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDTO, @Req() req: Request) {
    const data = await this.service.login(body, req.ip ?? 'unknown');
    return { success: true, data };
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    await this.service.logout(token, req.ip ?? 'unknown');
    return { success: true, message: 'Logged out successfully' };
  }

  @Get('check-session')
  async checkSession(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    await this.service.validateSession(token, req.ip ?? 'unknown', {
      updateLastActivity: false,
    });

    return {
      success: true,
      data: {
        active: true,
      },
    };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Req() req: Request) {
    await this.service.forgotPassword(body.email, body.campId, req.ip ?? 'unknown');
    return {
      success: true,
      message:
        'Si el correo pertenece a un usuario registrado, recibiras instrucciones para restablecer la contrasena.',
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto, @Req() req: Request) {
    await this.service.resetPassword(body.token, body.newPassword, req.ip ?? 'unknown');
    return {
      success: true,
      message: 'Contrasena actualizada correctamente',
    };
  }
}
