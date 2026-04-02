import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEvaluatedCriteriaReportDto {
  @ApiPropertyOptional()
  reportId?: number;

  @ApiPropertyOptional()
  criteriaId?: number;

  @ApiPropertyOptional()
  evaluatedValue?: string;

  @ApiPropertyOptional({ nullable: true })
  scoreObtained?: string | null;

  @ApiPropertyOptional({ nullable: true })
  observation?: string | null;

}