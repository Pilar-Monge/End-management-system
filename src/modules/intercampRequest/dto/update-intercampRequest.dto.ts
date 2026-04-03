import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { IntercampRequestStatus } from '../intercampRequest.model';

export class UpdateIntercampRequestDto {
  @ApiPropertyOptional()
  originCampId?: number;

  @ApiPropertyOptional()
  destinationCampId?: number;

  @ApiPropertyOptional()
  status?: IntercampRequestStatus;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  createdDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  responseDate?: Date | null;

  @ApiPropertyOptional()
  createdBy?: number;

  @ApiPropertyOptional({ nullable: true })
  respondedBy?: number | null;
}
