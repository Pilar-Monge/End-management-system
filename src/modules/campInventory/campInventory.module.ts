import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { CampInventoryController } from './campInventory.controller';
import { CampInventoryEntity } from './campInventory.entity';
import { CampInventoryRepository } from './campInventory.repository';
import { CampInventoryService } from './campInventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampInventoryEntity]), NotificationModule],
  controllers: [CampInventoryController],
  providers: [CampInventoryRepository, CampInventoryService],
})
export class CampInventoryModule {}
