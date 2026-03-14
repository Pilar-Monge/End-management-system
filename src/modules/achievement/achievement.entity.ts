import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'achievement' })
@Unique('uq_logro_nombre', ['name'])
export class AchievementEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'unlock_condition', type: 'text' })
  unlockCondition!: string;

  @Column({ name: 'icon_url', type: 'text', nullable: true })
  iconUrl!: string | null;
}
