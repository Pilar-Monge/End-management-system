import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryAlertController } from './inventoryAlert.controller';
import { InventoryAlertEntity } from './inventoryAlert.entity';
import { InventoryAlertRepository } from './inventoryAlert.repository';
import { InventoryAlertService } from './inventoryAlert.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAlertEntity])],
  controllers: [InventoryAlertController],
  providers: [InventoryAlertRepository, InventoryAlertService],
})
export class InventoryAlertModule {}
