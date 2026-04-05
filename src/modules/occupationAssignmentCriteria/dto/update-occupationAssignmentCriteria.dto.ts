import { ApiPropertyOptional } from '@nestjs/swagger';

import { OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES } from '../occupationAssignmentCriteria.model';

export class UpdateOccupationAssignmentCriteriaDto {
  @ApiPropertyOptional()
  occupationId?: number;

  @ApiPropertyOptional()
  criteriaDescription?: string;

  @ApiPropertyOptional({ enum: OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES })
  evaluatedField?: (typeof OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES)[number];

  @ApiPropertyOptional({ description: 'Number between 0.00 and 1.00' })
  weight?: string | number;

  @ApiPropertyOptional()
  active?: boolean;
}
