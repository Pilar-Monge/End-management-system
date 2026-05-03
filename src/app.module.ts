import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { SessionActivityMiddleware } from './common/middleware/session-activity.middleware';
import { AuthGuard, RolesGuard } from './common/guards';
import { AdmissionRequestModule } from './modules/admissionRequest/admissionRequest.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { AiAdmissionReportModule } from './modules/aiAdmissionReport/aiAdmissionReport.module';
import { AccessLogModule } from './modules/accessLog/accessLog.module';
import { CampModule } from './modules/camp/camp.module';
import { CampAchievementModule } from './modules/campAchievement/campAchievement.module';
import { CampInventoryModule } from './modules/campInventory/campInventory.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DailyCollectionRecordModule } from './modules/dailyCollectionRecord/dailyCollectionRecord.module';
import { ExpeditionModule } from './modules/expedition/expedition.module';
import { ExpeditionParticipantModule } from './modules/expeditionParticipant/expeditionParticipant.module';
import { ExpeditionResourceConsumedModule } from './modules/expeditionResourceConsumed/expeditionResourceConsumed.module';
import { ExpeditionResourceObtainedModule } from './modules/expeditionResourceObtained/expeditionResourceObtained.module';
import { InventoryAlertModule } from './modules/inventoryAlert/inventoryAlert.module';
import { InventoryMovementModule } from './modules/inventoryMovement/inventoryMovement.module';
import { IntercampRequestModule } from './modules/intercampRequest/intercampRequest.module';
import { OccupationModule } from './modules/occupation/occupation.module';
import { OccupationCoverageModule } from './modules/occupationCoverage/occupationCoverage.module';
import { PersonModule } from './modules/person/person.module';
import { PersonStatusHistoryModule } from './modules/personStatusHistory/personStatusHistory.module';
import { TemporaryOccupationAssignmentModule } from './modules/temporaryOccupationAssignment/temporaryOccupationAssignment.module';
import { RequestPersonDetailModule } from './modules/requestPersonDetail/requestPersonDetail.module';
import { RequestResourceDetailModule } from './modules/requestResourceDetail/requestResourceDetail.module';
import { DeliveredTransferResourceModule } from './modules/deliveredTransferResource/deliveredTransferResource.module';
import { ResourceTypeModule } from './modules/resourceType/resourceType.module';
import { SessionModule } from './modules/session/session.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { TransferHistoryModule } from './modules/transferHistory/transferHistory.module';
import { TransferPersonModule } from './modules/transferPerson/transferPerson.module';
import { UserRoleHistoryModule } from './modules/userRoleHistory/userRoleHistory.module';
import { UserModule } from './modules/systemUser/systemUser.module';
import { DecisionTreeModule } from './modules/decisionTree/decisionTree.module';
import { SystemTimeModule } from './modules/systemTime/systemTime.module';
import { TemporalAutomationModule } from './modules/temporalAutomation/temporalAutomation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isTrue = (value: string | undefined): boolean => value?.toLowerCase() === 'true';
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        const username = configService.get<string>('DB_USER');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_NAME');
        const synchronize = isTrue(configService.get<string>('DB_SYNC'));
        const useSsl = isTrue(configService.get<string>('DB_SSL'));

        if (!host || !port || !username || !password || !database) {
          throw new Error('Faltan variables de entorno de base de datos');
        }

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize,
        };
      },
    }),
    UserModule,
    AdmissionRequestModule,
    AchievementModule,
    CampAchievementModule,
    AiAdmissionReportModule,
    PersonModule,
    PersonStatusHistoryModule,
    TemporaryOccupationAssignmentModule,
    UserRoleHistoryModule,
    CampModule,
    ResourceTypeModule,
    OccupationModule,
    OccupationCoverageModule,
    CampInventoryModule,
    ExpeditionModule,
    ExpeditionParticipantModule,
    ExpeditionResourceConsumedModule,
    ExpeditionResourceObtainedModule,
    SessionModule,
    AccessLogModule,
    AuthModule,
    InventoryMovementModule,
    InventoryAlertModule,
    DailyCollectionRecordModule,
    IntercampRequestModule,
    RequestResourceDetailModule,
    RequestPersonDetailModule,
    TransferModule,
    TransferHistoryModule,
    TransferPersonModule,
    DeliveredTransferResourceModule,
    NotificationModule,
    DashboardModule,
    DecisionTreeModule,
    SystemTimeModule,
    TemporalAutomationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SessionActivityMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/system/time', method: RequestMethod.GET },
        { path: '', method: RequestMethod.GET },
        { path: 'docs', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
