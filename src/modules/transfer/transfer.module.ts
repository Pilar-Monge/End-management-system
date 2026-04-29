import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryMovementModule } from '../inventoryMovement/inventoryMovement.module';
import { NotificationModule } from '../notification/notification.module';
import { TransferController } from './transfer.controller';
import { TransferEntity } from './transfer.entity';
import { TransferRepository } from './transfer.repository';
import { TransferService } from './transfer.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferEntity]), NotificationModule, InventoryMovementModule],
  controllers: [TransferController],
  providers: [TransferRepository, TransferService],
  exports: [TransferService],
})
export class TransferModule {}
