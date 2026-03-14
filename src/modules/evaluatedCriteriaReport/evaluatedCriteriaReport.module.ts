import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EvaluatedCriteriaReportController } from './evaluatedCriteriaReport.controller';
import { EvaluatedCriteriaReportEntity } from './evaluatedCriteriaReport.entity';
import { EvaluatedCriteriaReportRepository } from './evaluatedCriteriaReport.repository';
import { EvaluatedCriteriaReportService } from './evaluatedCriteriaReport.service';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluatedCriteriaReportEntity])],
  controllers: [EvaluatedCriteriaReportController],
  providers: [EvaluatedCriteriaReportRepository, EvaluatedCriteriaReportService],
})
export class EvaluatedCriteriaReportModule {}
