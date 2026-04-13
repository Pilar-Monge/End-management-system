import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { RequestPersonDetailController } from './requestPersonDetail.controller';
import { RequestPersonDetailEntity } from './requestPersonDetail.entity';
import { RequestPersonDetailRepository } from './requestPersonDetail.repository';
import { RequestPersonDetailService } from './requestPersonDetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestPersonDetailEntity]), NotificationModule],
  controllers: [RequestPersonDetailController],
  providers: [RequestPersonDetailRepository, RequestPersonDetailService],
})
export class RequestPersonDetailModule {}
