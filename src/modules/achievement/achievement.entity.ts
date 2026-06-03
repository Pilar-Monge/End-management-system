import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'achievement' })
@Unique('uq_logro_nombre', ['name'])
export class AchievementEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  description!: string | null;

  @Column({ name: 'unlock_condition', type: 'text' })
  @ApiProperty()
  unlockCondition!: string;

  @Column({ name: 'icon_url', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  iconUrl!: string | null;

  @Column({ name: 'metric_key', type: 'text' })
  @ApiProperty()
  metricKey!: string;

  @Column({ name: 'operator', type: 'text' })
  @ApiProperty()
  operator!: string;

  @Column({ name: 'target_value', type: 'float' })
  @ApiProperty()
  targetValue!: number;

  @Column({ name: 'window_days', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  windowDays!: number | null;

  @Column({ name: 'scope', type: 'text', default: 'camp' })
  @ApiProperty()
  scope!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @ApiProperty()
  isActive!: boolean;
}
