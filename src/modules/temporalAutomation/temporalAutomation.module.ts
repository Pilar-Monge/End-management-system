import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampEntity } from '../camp/camp.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { DailyConsumptionEntity } from '../dailyConsumption/dailyConsumption.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryAlertEntity } from '../inventoryAlert/inventoryAlert.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { OccupationEntity } from '../occupation/occupation.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { SystemTimeModule } from '../systemTime/systemTime.module';
import { TemporaryOccupationAssignmentEntity } from '../temporaryOccupationAssignment/temporaryOccupationAssignment.entity';
import { TemporalAutomationService } from './temporalAutomation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampEntity,
      CampInventoryEntity,
      DailyConsumptionEntity,
      ExpeditionEntity,
      InventoryAlertEntity,
      InventoryMovementEntity,
      OccupationEntity,
      PersonEntity,
      ResourceTypeEntity,
      TemporaryOccupationAssignmentEntity,
    ]),
    SystemTimeModule,
  ],
  providers: [TemporalAutomationService],
})
export class TemporalAutomationModule {}
