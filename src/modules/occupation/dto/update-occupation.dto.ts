import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOccupationDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  collectsResources?: boolean;

  @ApiPropertyOptional()
  participatesInExpeditions?: boolean;

  @ApiPropertyOptional({ nullable: true })
  resourceTypeId?: number | null;

  @ApiPropertyOptional()
  dailyAmountProduced?: string;

  @ApiPropertyOptional()
  dailyRationConsumed?: string;

}