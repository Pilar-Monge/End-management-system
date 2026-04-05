import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { EXPEDITION_STATUS_VALUES, type ExpeditionStatus } from './expedition.model';
@Entity({ name: 'expedition' })
@Index('idx_expedition_camp', ['campId'])
@Index('idx_expedition_status', ['status'])
@Check('chk_expedition_dates', `"planned_return_date" > "planned_departure_date"`)
@Check('chk_dias_extra_disp', `"extra_days_available" >= 0`)
@Check('chk_dias_extra_usados', `"extra_days_used" >= 0`)
@Check('chk_dias_extra_coherencia', `"extra_days_used" <= "extra_days_available"`)
export class ExpeditionEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'objective', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  objective!: string | null;

  @Column({ name: 'destination_description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  destinationDescription!: string | null;

  @Column({
    name: 'destination_latitude',
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  @ApiProperty({ nullable: true })
  destinationLatitude!: string | null;

  @Column({
    name: 'destination_longitude',
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  @ApiProperty({ nullable: true })
  destinationLongitude!: string | null;

  @Column({ name: 'planned_departure_date', type: 'timestamptz' })
  @ApiProperty()
  plannedDepartureDate!: Date;

  @Column({ name: 'actual_departure_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  actualDepartureDate!: Date | null;

  @Column({ name: 'planned_return_date', type: 'timestamptz' })
  @ApiProperty()
  plannedReturnDate!: Date;

  @Column({ name: 'actual_return_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  actualReturnDate!: Date | null;

  @Column({ name: 'extra_days_available', type: 'int', default: 0 })
  @ApiProperty()
  extraDaysAvailable!: number;

  @Column({ name: 'extra_days_used', type: 'int', default: 0 })
  @ApiProperty()
  extraDaysUsed!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EXPEDITION_STATUS_VALUES,
    enumName: 'expedition_status_enum',
    default: 'PLANNED',
  })
  @ApiProperty({ enum: EXPEDITION_STATUS_VALUES })
  status!: ExpeditionStatus;

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
