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

  @ApiPropertyOptional({ nullable: true })
  plannedDepartureDate?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  plannedArrivalDate?: Date | null;

  @ApiPropertyOptional({
    type: 'array',
    isArray: true,
    nullable: false,
    description: 'Lista de requisitos de personas por oficio/rol',
  })
  personRequirements?: Array<{ occupationId: number; quantity: number }>;

  @ApiPropertyOptional()
  createdDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  responseDate?: Date | null;

  @ApiPropertyOptional()
  createdBy?: number;

  @ApiPropertyOptional({ nullable: true })
  respondedBy?: number | null;
}
