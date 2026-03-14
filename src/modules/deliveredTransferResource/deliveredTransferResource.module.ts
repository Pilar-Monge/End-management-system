import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveredTransferResourceController } from './deliveredTransferResource.controller';
import { DeliveredTransferResourceEntity } from './deliveredTransferResource.entity';
import { DeliveredTransferResourceRepository } from './deliveredTransferResource.repository';
import { DeliveredTransferResourceService } from './deliveredTransferResource.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveredTransferResourceEntity])],
  controllers: [DeliveredTransferResourceController],
  providers: [DeliveredTransferResourceRepository, DeliveredTransferResourceService],
})
export class DeliveredTransferResourceModule {}
