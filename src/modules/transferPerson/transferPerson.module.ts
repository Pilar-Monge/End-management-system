import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransferModule } from '../transfer/transfer.module';
import { NotificationModule } from '../notification/notification.module';
import { TransferPersonController } from './transferPerson.controller';
import { TransferPersonEntity } from './transferPerson.entity';
import { TransferPersonRepository } from './transferPerson.repository';
import { TransferPersonService } from './transferPerson.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferPersonEntity]), NotificationModule, TransferModule],
  controllers: [TransferPersonController],
  providers: [TransferPersonRepository, TransferPersonService],
  exports: [TransferPersonService],
})
export class TransferPersonModule {}
