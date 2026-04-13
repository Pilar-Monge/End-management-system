import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { ExpeditionResourceConsumedController } from './expeditionResourceConsumed.controller';
import { ExpeditionResourceConsumedEntity } from './expeditionResourceConsumed.entity';
import { ExpeditionResourceConsumedRepository } from './expeditionResourceConsumed.repository';
import { ExpeditionResourceConsumedService } from './expeditionResourceConsumed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpeditionResourceConsumedEntity,
      ExpeditionEntity,
      InventoryMovementEntity,
      UserEntity,
    ]),
    NotificationModule,
  ],
  controllers: [ExpeditionResourceConsumedController],
  providers: [ExpeditionResourceConsumedRepository, ExpeditionResourceConsumedService],
})
export class ExpeditionResourceConsumedModule {}
