import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class SessionActivityMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      next();
      return;
    }

    const payload = await this.authService.validateSession(token, req.ip ?? 'unknown', {
      updateLastActivity: true,
    });

    req.user = {
      userId: payload.userId,
      campId: payload.campId,
      rol: payload.rol,
    };

    next();
  }
}
