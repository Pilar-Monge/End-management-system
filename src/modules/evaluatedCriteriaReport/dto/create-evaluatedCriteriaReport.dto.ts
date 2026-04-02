import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluatedCriteriaReportDto {
  @ApiProperty()
  reportId!:  number;

  @ApiProperty()
  criteriaId!:  number;

  @ApiProperty()
  evaluatedValue!:  string;

  @ApiPropertyOptional({ nullable: true })
  scoreObtained?: string | null;

  @ApiPropertyOptional({ nullable: true })
  observation?: string | null;

}