import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampInventoryController } from './campInventory.controller';
import { CampInventoryEntity } from './campInventory.entity';
import { CampInventoryRepository } from './campInventory.repository';
import { CampInventoryService } from './campInventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampInventoryEntity])],
  controllers: [CampInventoryController],
  providers: [CampInventoryRepository, CampInventoryService],
})
export class CampInventoryModule {}
