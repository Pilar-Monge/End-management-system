import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAchievementDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  unlockCondition?: string;

  @ApiPropertyOptional({ nullable: true })
  iconUrl?: string | null;

  @ApiPropertyOptional()
  metricKey?: string;

  @ApiPropertyOptional()
  operator?: string;

  @ApiPropertyOptional()
  targetValue?: number;

  @ApiPropertyOptional({ nullable: true })
  windowDays?: number | null;

  @ApiPropertyOptional()
  scope?: string;

  @ApiPropertyOptional()
  isActive?: boolean;
}
