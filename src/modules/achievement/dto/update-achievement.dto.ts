import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAchievementDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  unlockCondition?: string;

  @ApiPropertyOptional({ nullable: true })
  iconUrl?: string | null;
}
