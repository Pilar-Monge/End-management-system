import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camp_achievement' })
export class CampAchievementEntity {
  @PrimaryColumn({ name: 'camp_id', type: 'int' })
  campId!: number;

  @PrimaryColumn({ name: 'logro_id', type: 'int' })
  achievementId!: number;

  @Column({
    name: 'obtained_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  obtainedDate!: Date;

  @Column({ name: 'unlocked_by', type: 'int' })
  unlockedBy!: number;

  @Column({ name: 'unlock_context', type: 'text', nullable: true })
  unlockContext!: string | null;
}
