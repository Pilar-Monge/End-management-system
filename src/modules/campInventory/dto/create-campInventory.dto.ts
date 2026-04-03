import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampInventoryDto {
  @ApiProperty()
  campId!: number;

  @ApiProperty()
  resourceTypeId!: number;

  @ApiPropertyOptional()
  currentAmount?: string;

  @ApiPropertyOptional()
  minimumAlertAmount?: string;
}
