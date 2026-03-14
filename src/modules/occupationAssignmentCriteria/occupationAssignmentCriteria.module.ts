import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OccupationAssignmentCriteriaController } from './occupationAssignmentCriteria.controller';
import { OccupationAssignmentCriteriaEntity } from './occupationAssignmentCriteria.entity';
import { OccupationAssignmentCriteriaRepository } from './occupationAssignmentCriteria.repository';
import { OccupationAssignmentCriteriaService } from './occupationAssignmentCriteria.service';

@Module({
  imports: [TypeOrmModule.forFeature([OccupationAssignmentCriteriaEntity])],
  controllers: [OccupationAssignmentCriteriaController],
  providers: [OccupationAssignmentCriteriaRepository, OccupationAssignmentCriteriaService],
})
export class OccupationAssignmentCriteriaModule {}
