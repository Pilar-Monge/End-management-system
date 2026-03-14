import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestPersonDetailController } from './requestPersonDetail.controller';
import { RequestPersonDetailEntity } from './requestPersonDetail.entity';
import { RequestPersonDetailRepository } from './requestPersonDetail.repository';
import { RequestPersonDetailService } from './requestPersonDetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestPersonDetailEntity])],
  controllers: [RequestPersonDetailController],
  providers: [RequestPersonDetailRepository, RequestPersonDetailService],
})
export class RequestPersonDetailModule {}
