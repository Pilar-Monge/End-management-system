import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampAchievementDto {
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
