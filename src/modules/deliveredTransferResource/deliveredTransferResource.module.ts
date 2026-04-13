import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { DeliveredTransferResourceController } from './deliveredTransferResource.controller';
import { DeliveredTransferResourceEntity } from './deliveredTransferResource.entity';
import { DeliveredTransferResourceRepository } from './deliveredTransferResource.repository';
import { DeliveredTransferResourceService } from './deliveredTransferResource.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveredTransferResourceEntity]), NotificationModule],
  controllers: [DeliveredTransferResourceController],
  providers: [DeliveredTransferResourceRepository, DeliveredTransferResourceService],
})
export class DeliveredTransferResourceModule {}
