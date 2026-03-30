import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { OccupationCriteriaEvaluatedField } from '../occupationAssignmentCriteria.model';

export class CreateOccupationAssignmentCriteriaDto {
  @ApiProperty()
  occupationId!:  number;

  @ApiProperty()
  criteriaDescription!:  string;

  @ApiProperty()
  evaluatedField!:  OccupationCriteriaEvaluatedField;

  @ApiPropertyOptional()
  weight?: string;

  @ApiPropertyOptional()
  active?: boolean;

}