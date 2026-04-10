import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessLogEntity } from '../modules/accessLog/accessLog.entity';
import { SessionEntity } from '../modules/session/session.entity';
import { UserEntity } from '../modules/systemUser/systemUser.entity';
import { UserRepository } from '../modules/systemUser/systemUser.repository';
import { SystemTimeModule } from '../modules/systemTime/systemTime.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, AccessLogEntity, UserEntity]), SystemTimeModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
