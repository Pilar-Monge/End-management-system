import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluatedCriteriaReportDto {
  @ApiProperty()
  reportId!: number;

  @ApiProperty()
  criteriaId!: number;

  @ApiProperty()
  evaluatedValue!: string;

  @ApiPropertyOptional({ nullable: true, description: 'Optional numeric score' })
  scoreObtained?: string | number | null;

  @ApiPropertyOptional({ nullable: true })
  observation?: string | null;
}
