import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiAdmissionReportController } from './aiAdmissionReport.controller';
import { AiAdmissionReportEntity } from './aiAdmissionReport.entity';
import { AiAdmissionReportRepository } from './aiAdmissionReport.repository';
import { AiAdmissionReportService } from './aiAdmissionReport.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiAdmissionReportEntity])],
  controllers: [AiAdmissionReportController],
  providers: [AiAdmissionReportRepository, AiAdmissionReportService],
})
export class AiAdmissionReportModule {}
