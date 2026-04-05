import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'camp_achievement' })
export class CampAchievementEntity {
  @PrimaryColumn({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @PrimaryColumn({ name: 'logro_id', type: 'int' })
  @ApiProperty()
  achievementId!: number;

  @Column({
    name: 'obtained_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  obtainedDate!: Date;

  @Column({ name: 'unlocked_by', type: 'int' })
  @ApiProperty()
  unlockedBy!: number;

  @Column({ name: 'unlock_context', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  unlockContext!: string | null;
}
