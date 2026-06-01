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
    name: 'unlocked_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  unlockedAt!: Date;

  @Column({ name: 'unlocked_by', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  unlockedBy!: number | null;

  @Column({ name: 'progress_snapshot', type: 'float', nullable: true })
  @ApiProperty({ nullable: true })
  progressSnapshot!: number | null;

  @Column({ name: 'source_run_id', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  sourceRunId!: string | null;

  @Column({ name: 'unlock_context', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  unlockContext!: string | null;

  @Column({ name: 'is_seen', type: 'boolean', default: false })
  @ApiProperty()
  isSeen!: boolean;
}
