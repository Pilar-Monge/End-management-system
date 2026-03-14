import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransferHistoryController } from './transferHistory.controller';
import { TransferHistoryEntity } from './transferHistory.entity';
import { TransferHistoryRepository } from './transferHistory.repository';
import { TransferHistoryService } from './transferHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferHistoryEntity])],
  controllers: [TransferHistoryController],
  providers: [TransferHistoryRepository, TransferHistoryService],
})
export class TransferHistoryModule {}
