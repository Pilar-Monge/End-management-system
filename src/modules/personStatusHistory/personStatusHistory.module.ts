import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { PersonStatusHistoryController } from './personStatusHistory.controller';
import { PersonStatusHistoryEntity } from './personStatusHistory.entity';
import { PersonStatusHistoryRepository } from './personStatusHistory.repository';
import { PersonStatusHistoryService } from './personStatusHistory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonStatusHistoryEntity, PersonEntity, UserEntity]),
    NotificationModule,
  ],
  controllers: [PersonStatusHistoryController],
  providers: [PersonStatusHistoryRepository, PersonStatusHistoryService],
})
export class PersonStatusHistoryModule {}
