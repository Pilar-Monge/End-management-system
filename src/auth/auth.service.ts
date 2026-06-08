import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, createHmac, randomBytes, randomInt, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { EncryptionService } from '../services/encryption.service';
import { EmailOutboxService } from '../modules/email/emailOutbox.service';
import { NotificationService } from '../modules/notification/notification.service';
import { PersonService } from '../modules/person/person.service';
import { UserRepository } from '../modules/systemUser/systemUser.repository';
import { SystemTimeService } from '../modules/systemTime/systemTime.service';
import { AuthRepository } from './auth.repository';
import type { JwtPayload, LoginDTO, LoginResponse, SessionValidationOptions } from './auth.model';

const SESSION_INACTIVITY_MINUTES = 20;
const PASSWORD_RESET_CODE_DIGITS = 8;
const PASSWORD_RESET_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly systemUserRepository: UserRepository,
    private readonly systemTimeService: SystemTimeService,
    private readonly emailOutboxService: EmailOutboxService,
    private readonly notificationService: NotificationService,
    private readonly personService: PersonService,
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
        role: user.role,
        campId: user.campId,
        personId: user.personId,
        status: user.status,
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

  async rotateSessionToken(token: string, payload: JwtPayload): Promise<string> {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';
    if (!normalizedToken) {
      throw new UnauthorizedException('Token requerido');
    }

    const nextToken = await this.generateToken(payload);
    const now = this.systemTimeService.now();
    const expirationDate = new Date(now.getTime() + SESSION_INACTIVITY_MINUTES * 60 * 1000);
    const replaced = await this.authRepository.replaceActiveSessionToken(
      normalizedToken,
      nextToken,
      expirationDate,
      now,
    );

    if (!replaced) {
      throw new UnauthorizedException('SesiÃ³n no encontrada');
    }

    return nextToken;
  }

  async forgotPassword(
    username: string,
    email: string,
    campId: number,
    ip: string,
  ): Promise<void> {
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    if (!normalizedUsername || !normalizedEmail || !Number.isInteger(campId) || campId <= 0) {
      return;
    }

    const user = await this.systemUserRepository.findByUsernameEmailAndCamp(
      normalizedUsername,
      normalizedEmail,
      campId,
    );
    if (!user || user.status !== 'ACTIVE') {
      return;
    }

    const now = this.systemTimeService.now();
    const ttlMinutes = this.resolvePasswordResetTtlMinutes();
    const rawToken = randomBytes(64).toString('hex');
    const resetCode = this.generatePasswordResetCode();
    const tokenHash = this.hashResetToken(rawToken);
    const codeHash = await this.hashPasswordResetCode(resetCode, user.id, user.campId);
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    await this.authRepository.invalidateActivePasswordResetTokens(user.id);
    await this.authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      codeHash,
      expiresAt,
      requestIp: ip,
      maxAttempts: PASSWORD_RESET_MAX_ATTEMPTS,
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

    await this.notificationService.notifyUser(user.id, {
      campId: user.campId,
      type: 'PASSWORD_RESET_REQUESTED',
      title: 'Solicitud de recuperacion de contrasena',
      message: 'Se registro una solicitud para restablecer tu contrasena.',
      sourceType: 'auth_password_reset',
      sourceId: user.id,
      sendEmail: false,
    });

    await this.emailOutboxService.enqueue({
      toEmail: user.email,
      subject: 'Recuperacion de contrasena',
      templateKey: 'password_reset_request',
      payload: {
        resetCode,
        expirationMinutes: String(ttlMinutes),
      },
    });
  }

  async resetPassword(
    username: string,
    email: string,
    campId: number,
    code: string,
    newPassword: string,
    ip: string,
  ): Promise<void> {
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedCode = typeof code === 'string' ? code.trim() : '';
    const normalizedPassword = typeof newPassword === 'string' ? newPassword.trim() : '';

    if (
      !normalizedUsername ||
      !normalizedEmail ||
      !Number.isInteger(campId) ||
      campId <= 0 ||
      !/^\d{8}$/.test(normalizedCode) ||
      normalizedPassword.length < 8
    ) {
      throw new BadRequestException('Codigo o contrasena invalida');
    }

    const now = this.systemTimeService.now();
    const user = await this.systemUserRepository.findByUsernameEmailAndCamp(
      normalizedUsername,
      normalizedEmail,
      campId,
    );
    if (!user || user.status !== 'ACTIVE') {
      throw new BadRequestException('Codigo invalido o expirado');
    }

    const resetToken = await this.authRepository.findActivePasswordResetTokenByUserId(user.id, now);
    if (!resetToken) {
      throw new BadRequestException('Codigo invalido o expirado');
    }

    if (resetToken.attempts >= resetToken.maxAttempts) {
      await this.authRepository.expirePasswordResetToken(resetToken.id);
      throw new BadRequestException('Codigo invalido o expirado');
    }

    const codeDigest = this.createPasswordResetCodeDigest(normalizedCode, user.id, user.campId);
    const isCodeValid = await bcrypt.compare(codeDigest, resetToken.codeHash);
    if (!isCodeValid) {
      await this.authRepository.incrementPasswordResetTokenAttempts(resetToken.id);
      if (resetToken.attempts + 1 >= resetToken.maxAttempts) {
        await this.authRepository.expirePasswordResetToken(resetToken.id);
      }

      throw new BadRequestException('Codigo invalido o expirado');
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

    await this.notificationService.notifyUser(user.id, {
      campId: user.campId,
      type: 'PASSWORD_RESET_COMPLETED',
      title: 'Contrasena actualizada',
      message: 'Tu contrasena fue restablecida correctamente.',
      sourceType: 'auth_password_reset',
      sourceId: user.id,
      sendEmail: false,
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

  private generatePasswordResetCode(): string {
    return randomInt(0, 10 ** PASSWORD_RESET_CODE_DIGITS)
      .toString()
      .padStart(PASSWORD_RESET_CODE_DIGITS, '0');
  }

  private async hashPasswordResetCode(
    code: string,
    userId: number,
    campId: number,
  ): Promise<string> {
    const digest = this.createPasswordResetCodeDigest(code, userId, campId);
    return await bcrypt.hash(digest, 10);
  }

  private createPasswordResetCodeDigest(code: string, userId: number, campId: number): string {
    const secret = this.resolvePasswordResetCodeSecret();
    return createHmac('sha256', secret).update(`${userId}:${campId}:${code}`).digest('hex');
  }

  private resolvePasswordResetCodeSecret(): string {
    const configuredSecret = process.env.PASSWORD_RESET_CODE_SECRET?.trim();
    if (configuredSecret) {
      return configuredSecret;
    }

    const jwtSecret = process.env.JWT_SECRET?.trim();
    if (!jwtSecret) {
      throw new Error('PASSWORD_RESET_CODE_SECRET or JWT_SECRET is not configured');
    }

    return jwtSecret;
  }

  async updateMyPhoto(userId: number, file: Express.Multer.File): Promise<any> {
    const user = await this.systemUserRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.personId) {
      throw new BadRequestException(
        'El usuario no tiene un perfil de persona vinculado. Por favor, contacta al soporte técnico para vincular tu cuenta.',
      );
    }

    // El mecanismo transparente: El servicio de Auth usa internamente al de Personas
    // No hace falta que el frontend conozca el person_id, nosotros lo sabemos por la entidad User
    return await this.personService.uploadPersonPhoto(user.personId, file);
  }

  async getMe(userId: number): Promise<any> {
    const user = await this.systemUserRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let personData: any = null;
    if (user.personId) {
      personData = await this.personService.getPersonWithSignedUrl(user.personId);
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      rol: user.role,
      campId: user.campId,
      status: user.status,
      personId: user.personId,
      person: personData,
    };
  }
}
