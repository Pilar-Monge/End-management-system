import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, Min } from 'class-validator';

export const AI_DECISION_VALUES = ['ACCEPT', 'REJECT'] as const;
export type AiDecision = (typeof AI_DECISION_VALUES)[number];

export class ProcessAiAdmissionRequestDto {
  @ApiProperty({ example: 12, description: 'ID del oficio/ocupación sugerida por la IA' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  oficioSugeridoId!: number;

  @ApiProperty({ enum: AI_DECISION_VALUES, example: 'ACCEPT' })
  @IsIn(AI_DECISION_VALUES)
  decision!: AiDecision;
}
