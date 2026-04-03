import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { Public } from '../common/decorators';
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
}
