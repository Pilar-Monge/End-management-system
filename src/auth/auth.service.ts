import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserRepository } from '../modules/systemUser/systemUser.repository';
import { SystemTimeService } from '../modules/systemTime/systemTime.service';
import { AuthRepository } from './auth.repository';
import type { JwtPayload, LoginDTO, LoginResponse, SessionValidationOptions } from './auth.model';

const SESSION_INACTIVITY_MINUTES = 20;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly systemUserRepository: UserRepository,
    private readonly systemTimeService: SystemTimeService,
  ) {}

  async login(dto: LoginDTO, ip: string): Promise<LoginResponse> {
    const username = typeof dto.username === 'string' ? dto.username.trim() : '';
    const password = typeof dto.password === 'string' ? dto.password.trim() : '';
    const campId = Number.isInteger(dto.campId) ? dto.campId : NaN;

    if (!username || !password || !Number.isInteger(campId) || campId <= 0) {
      throw new BadRequestException('Credenciales incompletas');
    }

    const user = await this.systemUserRepository.findByUsername(username, campId);

    if (!user || user.status !== 'ACTIVE') {
      if (user) {
        await this.authRepository.createAccessLog({
          sessionId: null,
          userId: user.id,
          campId,
          eventType: 'FAILED_ATTEMPT',
          sourceIp: ip,
          detail: 'Invalid username or inactive user',
        });
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.authRepository.createAccessLog({
        sessionId: null,
        userId: user.id,
        campId: user.campId,
        eventType: 'FAILED_ATTEMPT',
        sourceIp: ip,
        detail: 'Invalid password',
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const payload: JwtPayload = {
      userId: user.id,
      campId: user.campId,
      rol: user.role,
    };

    const token = jwt.sign({ ...payload, jti: randomUUID() }, secret, {
      expiresIn: `${SESSION_INACTIVITY_MINUTES}m`,
    });

    const now = this.systemTimeService.now();
    const expirationDate = new Date(now.getTime() + SESSION_INACTIVITY_MINUTES * 60 * 1000);

    const session = await this.authRepository.createSession({
      token,
      userId: user.id,
      campId: user.campId,
      startDate: now,
      lastActivityDate: now,
      expirationDate,
      sourceIp: ip,
      status: 'ACTIVE',
    });

    await this.authRepository.createAccessLog({
      sessionId: session.id,
      userId: user.id,
      campId: user.campId,
      eventType: 'LOGIN',
      sourceIp: ip,
      detail: 'Successful login',
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.role,
        campId: user.campId,
      },
    };
  }

  async logout(token: string, ip: string): Promise<void> {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';
    if (!normalizedToken) {
      throw new BadRequestException('Credenciales incompletas');
    }

    const session = await this.authRepository.findActiveSessionByToken(normalizedToken);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    await this.authRepository.closeSession(session.id, this.systemTimeService.now());

    await this.authRepository.createAccessLog({
      sessionId: session.id,
      userId: session.userId,
      campId: session.campId,
      eventType: 'LOGOUT',
      sourceIp: ip,
      detail: 'Successful logout',
    });
  }

  decodeAndVerifyToken(token: string): JwtPayload {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';
    const secret = process.env.JWT_SECRET;

    if (!normalizedToken || !secret) {
      throw new UnauthorizedException('Token inválido');
    }

    let decodedToken: unknown;
    try {
      decodedToken = jwt.verify(normalizedToken, secret);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    if (
      typeof decodedToken !== 'object' ||
      decodedToken === null ||
      !('userId' in decodedToken) ||
      !('campId' in decodedToken) ||
      !('rol' in decodedToken) ||
      typeof decodedToken.userId !== 'number' ||
      typeof decodedToken.campId !== 'number' ||
      typeof decodedToken.rol !== 'string'
    ) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      userId: decodedToken.userId,
      campId: decodedToken.campId,
      rol: decodedToken.rol,
    };
  }

  async validateSession(
    token: string,
    ip: string,
    options?: SessionValidationOptions,
  ): Promise<JwtPayload> {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';
    const payload = this.decodeAndVerifyToken(normalizedToken);

    const session = await this.authRepository.findActiveSessionByToken(normalizedToken);
    if (!session) {
      throw new UnauthorizedException('Sesión no encontrada');
    }

    const now = this.systemTimeService.now();
    const inactiveMilliseconds = now.getTime() - session.lastActivityDate.getTime();

    if (inactiveMilliseconds >= SESSION_INACTIVITY_MINUTES * 60000) {
      await this.authRepository.expireSession(session.id, now);
      await this.authRepository.createAccessLog({
        sessionId: session.id,
        userId: session.userId,
        campId: session.campId,
        eventType: 'INACTIVITY_EXPIRATION',
        eventDate: now,
        sourceIp: ip,
        detail: 'EXPIRACION_INACTIVIDAD',
      });
      throw new UnauthorizedException('Sesión expirada por inactividad');
    }

    if (options?.updateLastActivity === true) {
      await this.authRepository.updateSessionLastActivity(session.id, now);
    }

    return payload;
  }

  async generateToken(payload: JwtPayload): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign({ ...payload, jti: randomUUID() }, secret, {
      expiresIn: `${SESSION_INACTIVITY_MINUTES}m`,
    });

    return token;
  }
}
