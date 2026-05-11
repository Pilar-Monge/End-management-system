import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, Min } from 'class-validator';

export const AI_DECISION_VALUES = ['ACCEPT', 'REJECT'] as const;
export type AiDecision = (typeof AI_DECISION_VALUES)[number];

export class ProcessAiAdmissionRequestDto {
  @ApiProperty({ example: 12, description: 'Suggested occupation ID proposed by the AI' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  oficioSugeridoId!: number;

  @ApiProperty({
    enum: AI_DECISION_VALUES,
    example: 'ACCEPT',
    description: 'AI recommendation only; final approval or rejection is made by an admin',
  })
  @IsIn(AI_DECISION_VALUES)
  decision!: AiDecision;
}
