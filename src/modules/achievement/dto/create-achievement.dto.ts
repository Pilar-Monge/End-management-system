import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty()
  name!:  string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  unlockCondition!:  string;

  @ApiPropertyOptional({ nullable: true })
  iconUrl?: string | null;

}