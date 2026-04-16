import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampEntity } from '../camp/camp.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { DailyConsumptionEntity } from '../dailyConsumption/dailyConsumption.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { ExpeditionParticipantEntity } from '../expeditionParticipant/expeditionParticipant.entity';
import { ExpeditionParticipantRepository } from '../expeditionParticipant/expeditionParticipant.repository';
import { InventoryAlertEntity } from '../inventoryAlert/inventoryAlert.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationModule } from '../notification/notification.module';
import { OccupationEntity } from '../occupation/occupation.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
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
      ExpeditionParticipantEntity,
      InventoryAlertEntity,
      InventoryMovementEntity,
      OccupationEntity,
      PersonEntity,
      ResourceTypeEntity,
      TemporaryOccupationAssignmentEntity,
      UserEntity,
    ]),
    SystemTimeModule,
    NotificationModule,
  ],
  providers: [TemporalAutomationService, ExpeditionParticipantRepository],
})
export class TemporalAutomationModule {}
