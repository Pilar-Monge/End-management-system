import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessLogController } from './accessLog.controller';
import { AccessLogEntity } from './accessLog.entity';
import { AccessLogRepository } from './accessLog.repository';
import { AccessLogService } from './accessLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLogEntity])],
  controllers: [AccessLogController],
  providers: [AccessLogRepository, AccessLogService],
})
export class AccessLogModule {}
