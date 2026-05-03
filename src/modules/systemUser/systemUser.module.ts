import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './systemUser.controller';
import { UserEntity } from './systemUser.entity';
import { UserRepository } from './systemUser.repository';
import { AccessLogEntity } from '../accessLog/accessLog.entity';
import { SessionEntity } from '../session/session.entity';
import { UserRoleHistoryEntity } from '../userRoleHistory/userRoleHistory.entity';
import { UserRoleHistoryRepository } from '../userRoleHistory/userRoleHistory.repository';
import { UserService } from './systemUser.service';
import { NotificationModule } from '../notification/notification.module';
import { SystemTimeModule } from '../systemTime/systemTime.module';
import { AuthRepository } from '../../auth/auth.repository';
import { PasswordResetTokenEntity } from '../../auth/passwordResetToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserRoleHistoryEntity,
      SessionEntity,
      AccessLogEntity,
      PasswordResetTokenEntity,
    ]),
    NotificationModule,
    SystemTimeModule,
  ],
  controllers: [UserController],
  providers: [UserRepository, UserRoleHistoryRepository, AuthRepository, UserService],
})
export class UserModule {}
