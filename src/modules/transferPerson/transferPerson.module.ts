import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { TransferPersonController } from './transferPerson.controller';
import { TransferPersonEntity } from './transferPerson.entity';
import { TransferPersonRepository } from './transferPerson.repository';
import { TransferPersonService } from './transferPerson.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferPersonEntity]), NotificationModule],
  controllers: [TransferPersonController],
  providers: [TransferPersonRepository, TransferPersonService],
})
export class TransferPersonModule {}
