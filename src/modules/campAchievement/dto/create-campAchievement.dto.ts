import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampAchievementDto {
  @ApiProperty()
  campId!: number;

  @ApiProperty()
  achievementId!: number;

  @ApiPropertyOptional()
  unlockedAt?: Date;

  @ApiPropertyOptional({ nullable: true })
  unlockedBy?: number | null;

  @ApiPropertyOptional({ nullable: true })
  progressSnapshot?: number | null;

  @ApiPropertyOptional({ nullable: true })
  sourceRunId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  unlockContext?: string | null;
}
