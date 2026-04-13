import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { EncryptionService } from '../services/encryption.service';
import { EmailOutboxService } from '../modules/email/emailOutbox.service';
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
    private readonly emailOutboxService: EmailOutboxService,
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

  async forgotPassword(email: string, campId: number, ip: string): Promise<void> {
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    if (!normalizedEmail || !Number.isInteger(campId) || campId <= 0) {
      return;
    }

    const user = await this.systemUserRepository.findByEmail(normalizedEmail, campId);
    if (!user || user.status !== 'ACTIVE') {
      return;
    }

    const now = this.systemTimeService.now();
    const ttlMinutes = this.resolvePasswordResetTtlMinutes();
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    await this.authRepository.invalidateActivePasswordResetTokens(user.id);
    await this.authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      requestIp: ip,
    });

    await this.authRepository.createAccessLog({
      sessionId: null,
      userId: user.id,
      campId: user.campId,
      eventType: 'PASSWORD_RESET_REQUEST',
      eventDate: now,
      sourceIp: ip,
      detail: 'PASSWORD_RESET_REQUESTED',
    });

    const resetUrl = this.buildPasswordResetUrl(rawToken);
    await this.emailOutboxService.enqueue({
      toEmail: user.email,
      subject: 'Recuperacion de contrasena',
      templateKey: 'password_reset_request',
      payload: {
        resetUrl,
        expirationMinutes: String(ttlMinutes),
      },
    });
  }

  async resetPassword(token: string, newPassword: string, ip: string): Promise<void> {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';
    const normalizedPassword = typeof newPassword === 'string' ? newPassword.trim() : '';

    if (!normalizedToken || normalizedPassword.length < 8) {
      throw new BadRequestException('Token o contrasena invalida');
    }

    const now = this.systemTimeService.now();
    const tokenHash = this.hashResetToken(normalizedToken);
    const resetToken = await this.authRepository.findActivePasswordResetTokenByHash(tokenHash, now);
    if (!resetToken) {
      throw new BadRequestException('Token invalido o expirado');
    }

    const user = await this.systemUserRepository.findById(resetToken.userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const passwordHash = await EncryptionService.hashPassword(normalizedPassword);
    await this.systemUserRepository.update(user.id, {
      passwordHash,
    });

    await this.authRepository.markPasswordResetTokenUsed(resetToken.id, now);
    await this.authRepository.invalidateActivePasswordResetTokens(user.id);
    await this.authRepository.closeActiveSessionsByUser(user.id, now);
    await this.authRepository.createAccessLog({
      sessionId: null,
      userId: user.id,
      campId: user.campId,
      eventType: 'PASSWORD_RESET_COMPLETED',
      eventDate: now,
      sourceIp: ip,
      detail: 'PASSWORD_RESET_SUCCESS',
    });

    await this.emailOutboxService.enqueue({
      toEmail: user.email,
      subject: 'Contrasena actualizada',
      templateKey: 'password_reset_confirmation',
      payload: {
        dateText: now.toISOString(),
      },
    });
  }

  private resolvePasswordResetTtlMinutes(): number {
    const parsed = Number.parseInt(process.env.PASSWORD_RESET_TTL_MINUTES ?? '30', 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return 30;
    }

    return parsed;
  }

  private hashResetToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private buildPasswordResetUrl(rawToken: string): string {
    const configuredBaseUrl = process.env.FRONTEND_RESET_PASSWORD_URL?.trim();
    const fallback = 'http://localhost:5173/reset-password';
    const baseUrl = configuredBaseUrl && configuredBaseUrl.length > 0 ? configuredBaseUrl : fallback;

    try {
      const url = new URL(baseUrl);
      url.searchParams.set('token', rawToken);
      return url.toString();
    } catch {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}token=${encodeURIComponent(rawToken)}`;
    }
  }
}
