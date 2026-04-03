import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTemporaryOccupationAssignmentDto {
  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional()
  temporaryOccupationId?: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  endDate?: Date | null;

  @ApiPropertyOptional()
  reason?: string;

  @ApiPropertyOptional()
  assignedBy?: number;
}
