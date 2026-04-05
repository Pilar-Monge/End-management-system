import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { CAMP_STATUS_VALUES, type CampStatus } from './camp.model';

@Entity({ name: 'camp' })
@Unique('uq_camp_name', ['name'])
@Index('idx_camp_status', ['status'])
export class CampEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'latitude', type: 'numeric', precision: 9, scale: 6 })
  @ApiProperty()
  latitude!: string;

  @Column({ name: 'longitude', type: 'numeric', precision: 9, scale: 6 })
  @ApiProperty()
  longitude!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  description!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CAMP_STATUS_VALUES,
    enumName: 'camp_status_enum',
    default: 'ACTIVE',
  })
  @ApiProperty({ enum: CAMP_STATUS_VALUES })
  status!: CampStatus;

  @Column({ name: 'foundation_date', type: 'date' })
  @ApiProperty()
  foundationDate!: Date;

  @Column({
    name: 'max_person_capacity',
    type: 'int',
    default: 100,
  })
  @ApiProperty()
  maxPersonCapacity!: number;

  @Column({
    name: 'session_inactivity_minutes',
    type: 'int',
    default: 20,
  })
  @ApiProperty()
  sessionInactivityMinutes!: number;

  @Column({
    name: 'minimum_daily_ration_per_person',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '1.00',
  })
  @ApiProperty()
  minimumDailyRationPerPerson!: string;

  @Column({
    name: 'stock_alert_threshold_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: '20.00',
  })
  @ApiProperty()
  stockAlertThresholdPercentage!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  updatedAt!: Date;
}
