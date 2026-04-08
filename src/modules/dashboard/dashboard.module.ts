import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      PersonEntity,
      AdmissionRequestEntity,
      CampInventoryEntity,
      ResourceTypeEntity,
      ExpeditionEntity,
      InventoryMovementEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
