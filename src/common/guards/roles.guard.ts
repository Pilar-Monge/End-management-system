import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isAuthenticatedOnly = this.reflector.getAllAndOverride<boolean>('authenticatedOnly', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAuthenticatedOnly) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      throw new ForbiddenException('Acceso denegado');
    }

    const request = context.switchToHttp().getRequest<Request & { user?: { rol?: string } }>();

    if (!request.user?.rol || !roles.includes(request.user.rol)) {
      throw new ForbiddenException('Acceso denegado');
    }

    return true;
  }
}
