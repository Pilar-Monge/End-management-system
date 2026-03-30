import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { OccupationCriteriaEvaluatedField } from '../occupationAssignmentCriteria.model';

export class UpdateOccupationAssignmentCriteriaDto {
  @ApiPropertyOptional()
  occupationId?: number;

  @ApiPropertyOptional()
  criteriaDescription?: string;

  @ApiPropertyOptional()
  evaluatedField?: OccupationCriteriaEvaluatedField;

  @ApiPropertyOptional()
  weight?: string;

  @ApiPropertyOptional()
  active?: boolean;

}