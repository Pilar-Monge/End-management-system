import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { CAMP_STATUS_VALUES, type CampStatus } from './camp.model';

@Entity({ name: 'camp' })
@Unique('uq_camp_name', ['name'])
@Index('idx_camp_status', ['status'])
export class CampEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'latitude', type: 'numeric', precision: 9, scale: 6 })
  latitude!: string;

  @Column({ name: 'longitude', type: 'numeric', precision: 9, scale: 6 })
  longitude!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CAMP_STATUS_VALUES,
    enumName: 'camp_status_enum',
    default: 'ACTIVE',
  })
  status!: CampStatus;

  @Column({ name: 'foundation_date', type: 'date' })
  foundationDate!: Date;

  @Column({
    name: 'max_person_capacity',
    type: 'int',
    default: 100,
  })
  maxPersonCapacity!: number;

  @Column({
    name: 'session_inactivity_minutes',
    type: 'int',
    default: 20,
  })
  sessionInactivityMinutes!: number;

  @Column({
    name: 'minimum_daily_ration_per_person',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '1.00',
  })
  minimumDailyRationPerPerson!: string;

  @Column({
    name: 'stock_alert_threshold_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: '20.00',
  })
  stockAlertThresholdPercentage!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt!: Date;
}
