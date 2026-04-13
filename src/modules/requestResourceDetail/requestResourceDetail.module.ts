import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { RequestResourceDetailController } from './requestResourceDetail.controller';
import { RequestResourceDetailEntity } from './requestResourceDetail.entity';
import { RequestResourceDetailRepository } from './requestResourceDetail.repository';
import { RequestResourceDetailService } from './requestResourceDetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestResourceDetailEntity]), NotificationModule],
  controllers: [RequestResourceDetailController],
  providers: [RequestResourceDetailRepository, RequestResourceDetailService],
})
export class RequestResourceDetailModule {}
