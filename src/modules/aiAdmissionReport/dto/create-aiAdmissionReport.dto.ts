import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { AiDecision } from '../aiAdmissionReport.model';

export class CreateAiAdmissionReportDto {
  @ApiProperty()
  requestId!: number;

  @ApiProperty()
  submittedData!: unknown;

  @ApiProperty()
  aiResponse!: unknown;

  @ApiProperty()
  aiDecision!: AiDecision;

  @ApiPropertyOptional({ nullable: true })
  aiJustification?: string | null;

  @ApiPropertyOptional({ nullable: true })
  suggestedOccupationId?: number | null;
}
