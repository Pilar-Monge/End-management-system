import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemporaryOccupationAssignmentDto {
  @ApiProperty()
  personId!: number;

  @ApiProperty()
  temporaryOccupationId!: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  endDate?: Date | null;

  @ApiProperty()
  reason!: string;

  @ApiProperty()
  assignedBy!: number;
}
