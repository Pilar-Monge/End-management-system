import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { AiAdmissionReportController } from './aiAdmissionReport.controller';
import { AiAdmissionReportEntity } from './aiAdmissionReport.entity';
import { AiAdmissionReportRepository } from './aiAdmissionReport.repository';
import { AiAdmissionReportService } from './aiAdmissionReport.service';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiAdmissionReportEntity, AdmissionRequestEntity]),
    NotificationModule,
  ],
  controllers: [AiAdmissionReportController],
  providers: [AiAdmissionReportRepository, AiAdmissionReportService],
})
export class AiAdmissionReportModule {}
