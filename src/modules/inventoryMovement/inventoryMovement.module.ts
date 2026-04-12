import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryMovementController } from './inventoryMovement.controller';
import { InventoryMovementEntity } from './inventoryMovement.entity';
import { InventoryMovementRepository } from './inventoryMovement.repository';
import { InventoryMovementService } from './inventoryMovement.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovementEntity]), NotificationModule],
  controllers: [InventoryMovementController],
  providers: [InventoryMovementRepository, InventoryMovementService],
})
export class InventoryMovementModule {}
