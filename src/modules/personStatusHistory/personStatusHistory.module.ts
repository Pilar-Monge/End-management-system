import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonStatusHistoryController } from './personStatusHistory.controller';
import { PersonStatusHistoryEntity } from './personStatusHistory.entity';
import { PersonStatusHistoryRepository } from './personStatusHistory.repository';
import { PersonStatusHistoryService } from './personStatusHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonStatusHistoryEntity])],
  controllers: [PersonStatusHistoryController],
  providers: [PersonStatusHistoryRepository, PersonStatusHistoryService],
})
export class PersonStatusHistoryModule {}
