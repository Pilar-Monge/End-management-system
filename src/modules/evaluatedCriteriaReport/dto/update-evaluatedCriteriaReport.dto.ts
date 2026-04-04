import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEvaluatedCriteriaReportDto {
  @ApiPropertyOptional()
  reportId?: number;

  @ApiPropertyOptional()
  criteriaId?: number;

  @ApiPropertyOptional()
  evaluatedValue?: string;

  @ApiPropertyOptional({ nullable: true })
  scoreObtained?: string | number | null;

  @ApiPropertyOptional({ nullable: true })
  observation?: string | null;
}
