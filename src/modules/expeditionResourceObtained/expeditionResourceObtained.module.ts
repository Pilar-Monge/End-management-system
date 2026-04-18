import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { ExpeditionResourceObtainedController } from './expeditionResourceObtained.controller';
import { ExpeditionResourceObtainedEntity } from './expeditionResourceObtained.entity';
import { ExpeditionResourceObtainedRepository } from './expeditionResourceObtained.repository';
import { ExpeditionResourceObtainedService } from './expeditionResourceObtained.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpeditionResourceObtainedEntity]), NotificationModule],
  controllers: [ExpeditionResourceObtainedController],
  providers: [ExpeditionResourceObtainedRepository, ExpeditionResourceObtainedService],
})
export class ExpeditionResourceObtainedModule {}
