import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { SystemTimeModule } from '../systemTime/systemTime.module';

import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
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
    SystemTimeModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
