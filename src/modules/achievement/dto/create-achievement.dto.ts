import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  unlockCondition!: string;

  @ApiPropertyOptional({ nullable: true })
  iconUrl?: string | null;

  @ApiProperty()
  metricKey!: string;

  @ApiProperty()
  operator!: string;

  @ApiProperty()
  targetValue!: number;

  @ApiPropertyOptional({ nullable: true })
  windowDays?: number | null;

  @ApiPropertyOptional({ default: 'camp' })
  scope?: string;

  @ApiPropertyOptional({ default: true })
  isActive?: boolean;
}
