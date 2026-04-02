import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from '../session/session.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { AccessLogController } from './accessLog.controller';
import { AccessLogEntity } from './accessLog.entity';
import { AccessLogRepository } from './accessLog.repository';
import { AccessLogService } from './accessLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLogEntity, UserEntity, SessionEntity])],
  controllers: [AccessLogController],
  providers: [AccessLogRepository, AccessLogService],
})
export class AccessLogModule {}
