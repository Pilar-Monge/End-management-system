import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessLogEntity } from '../modules/accessLog/accessLog.entity';
import { EmailModule } from '../modules/email/email.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { SessionEntity } from '../modules/session/session.entity';
import { UserEntity } from '../modules/systemUser/systemUser.entity';
import { UserRepository } from '../modules/systemUser/systemUser.repository';
import { SystemTimeModule } from '../modules/systemTime/systemTime.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { PasswordResetTokenEntity } from './passwordResetToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      AccessLogEntity,
      UserEntity,
      PasswordResetTokenEntity,
    ]),
    SystemTimeModule,
    EmailModule,
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
