import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCollectionRecordController } from './dailyCollectionRecord.controller';
import { DailyCollectionRecordEntity } from './dailyCollectionRecord.entity';
import { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import { DailyCollectionRecordService } from './dailyCollectionRecord.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyCollectionRecordEntity])],
  controllers: [DailyCollectionRecordController],
  providers: [DailyCollectionRecordRepository, DailyCollectionRecordService],
})
export class DailyCollectionRecordModule {}
