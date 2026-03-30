import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { AiDecision } from '../aiAdmissionReport.model';

export class UpdateAiAdmissionReportDto {
  @ApiPropertyOptional()
  requestId?: number;

  @ApiPropertyOptional()
  submittedData?: unknown;

  @ApiPropertyOptional()
  aiResponse?: unknown;

  @ApiPropertyOptional()
  aiDecision?: AiDecision;

  @ApiPropertyOptional({ nullable: true })
  aiJustification?: string | null;

  @ApiPropertyOptional({ nullable: true })
  suggestedOccupationId?: number | null;

}