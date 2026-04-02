import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { ParticipantStatus } from '../expeditionParticipant.model';

export class UpdateExpeditionParticipantDto {
  @ApiPropertyOptional()
  expeditionId?: number;

  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional({ nullable: true })
  expeditionRole?: string | null;

  @ApiPropertyOptional()
  status?: ParticipantStatus;

  @ApiPropertyOptional()
  assignmentDate?: Date;

}