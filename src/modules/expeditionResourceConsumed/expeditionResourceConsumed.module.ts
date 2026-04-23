import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { ExpeditionResourceConsumedController } from './expeditionResourceConsumed.controller';
import { ExpeditionResourceConsumedEntity } from './expeditionResourceConsumed.entity';
import { ExpeditionResourceConsumedRepository } from './expeditionResourceConsumed.repository';
import { ExpeditionResourceConsumedService } from './expeditionResourceConsumed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpeditionResourceConsumedEntity]), NotificationModule],
  controllers: [ExpeditionResourceConsumedController],
  providers: [ExpeditionResourceConsumedRepository, ExpeditionResourceConsumedService],
})
export class ExpeditionResourceConsumedModule {}
