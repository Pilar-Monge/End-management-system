import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { PersonEntity } from '../person/person.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { DailyCollectionRecordController } from './dailyCollectionRecord.controller';
import { DailyCollectionRecordEntity } from './dailyCollectionRecord.entity';
import { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import { DailyCollectionRecordService } from './dailyCollectionRecord.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyCollectionRecordEntity,
      PersonEntity,
      UserEntity,
      InventoryMovementEntity,
    ]),
  ],
  controllers: [DailyCollectionRecordController],
  providers: [DailyCollectionRecordRepository, DailyCollectionRecordService],
})
export class DailyCollectionRecordModule {}
