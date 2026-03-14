import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryMovementController } from './inventoryMovement.controller';
import { InventoryMovementEntity } from './inventoryMovement.entity';
import { InventoryMovementRepository } from './inventoryMovement.repository';
import { InventoryMovementService } from './inventoryMovement.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovementEntity])],
  controllers: [InventoryMovementController],
  providers: [InventoryMovementRepository, InventoryMovementService],
})
export class InventoryMovementModule {}
