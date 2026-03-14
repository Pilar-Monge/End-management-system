import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AdmissionRequestModule } from './modules/admissionRequest/admissionRequest.module';
import { AiAdmissionReportModule } from './modules/aiAdmissionReport/aiAdmissionReport.module';
import { AccessLogModule } from './modules/accessLog/accessLog.module';
import { CampModule } from './modules/camp/camp.module';
import { CampInventoryModule } from './modules/campInventory/campInventory.module';
import { DailyCollectionRecordModule } from './modules/dailyCollectionRecord/dailyCollectionRecord.module';
import { EvaluatedCriteriaReportModule } from './modules/evaluatedCriteriaReport/evaluatedCriteriaReport.module';
import { ExpeditionModule } from './modules/expedition/expedition.module';
import { ExpeditionParticipantModule } from './modules/expeditionParticipant/expeditionParticipant.module';
import { ExpeditionResourceConsumedModule } from './modules/expeditionResourceConsumed/expeditionResourceConsumed.module';
import { ExpeditionResourceObtainedModule } from './modules/expeditionResourceObtained/expeditionResourceObtained.module';
import { InventoryAlertModule } from './modules/inventoryAlert/inventoryAlert.module';
import { InventoryMovementModule } from './modules/inventoryMovement/inventoryMovement.module';
import { OccupationAssignmentCriteriaModule } from './modules/occupationAssignmentCriteria/occupationAssignmentCriteria.module';
import { OccupationModule } from './modules/occupation/occupation.module';
import { PersonModule } from './modules/person/person.module';
import { PersonStatusHistoryModule } from './modules/personStatusHistory/personStatusHistory.module';
import { ResourceTypeModule } from './modules/resourceType/resourceType.module';
import { SessionModule } from './modules/session/session.module';
import { UserRoleHistoryModule } from './modules/userRoleHistory/userRoleHistory.module';
import { UserModule } from './modules/systemUser/systemUser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER ?? 'gestionfin',
      password: process.env.DB_PASSWORD ?? 'gestionfin123',
      database: process.env.DB_NAME ?? 'gestionfin_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdmissionRequestModule,
    AiAdmissionReportModule,
    EvaluatedCriteriaReportModule,
    PersonModule,
    PersonStatusHistoryModule,
    UserRoleHistoryModule,
    CampModule,
    ResourceTypeModule,
    OccupationModule,
    CampInventoryModule,
    ExpeditionModule,
    ExpeditionParticipantModule,
    ExpeditionResourceConsumedModule,
    ExpeditionResourceObtainedModule,
    SessionModule,
    AccessLogModule,
    InventoryMovementModule,
    InventoryAlertModule,
    DailyCollectionRecordModule,
    OccupationAssignmentCriteriaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
