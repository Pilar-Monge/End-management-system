import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { IntercampRequestStatus } from '../intercampRequest.model';

export class CreateIntercampRequestDto {
  @ApiProperty()
  originCampId!:  number;

  @ApiProperty()
  destinationCampId!:  number;

  @ApiPropertyOptional()
  status?: IntercampRequestStatus;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  createdDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  responseDate?: Date | null;

  @ApiProperty()
  createdBy!:  number;

  @ApiPropertyOptional({ nullable: true })
  respondedBy?: number | null;

}