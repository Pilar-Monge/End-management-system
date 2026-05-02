import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { OccupationCoverageModule } from '../occupationCoverage/occupationCoverage.module';

import { TemporaryOccupationAssignmentController } from './temporaryOccupationAssignment.controller';
import { TemporaryOccupationAssignmentEntity } from './temporaryOccupationAssignment.entity';
import { TemporaryOccupationAssignmentRepository } from './temporaryOccupationAssignment.repository';
import { TemporaryOccupationAssignmentService } from './temporaryOccupationAssignment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemporaryOccupationAssignmentEntity]),
    NotificationModule,
    OccupationCoverageModule,
  ],
  controllers: [TemporaryOccupationAssignmentController],
  providers: [TemporaryOccupationAssignmentRepository, TemporaryOccupationAssignmentService],
})
export class TemporaryOccupationAssignmentModule {}
