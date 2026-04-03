import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampInventoryDto {
  @ApiPropertyOptional()
  currentAmount?: string;

  @ApiPropertyOptional()
  minimumAlertAmount?: string;
}
