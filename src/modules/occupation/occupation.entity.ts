import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'occupation' })
@Unique('uq_occupation_name', ['name'])
export class OccupationEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  description!: string | null;

  @Column({
    name: 'collects_resources',
    type: 'boolean',
    default: false,
  })
  @ApiProperty()
  collectsResources!: boolean;

  @Column({
    name: 'participates_in_expeditions',
    type: 'boolean',
    default: false,
  })
  @ApiProperty()
  participatesInExpeditions!: boolean;

  @Column({ name: 'resource_type_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  resourceTypeId!: number | null;

  @Column({
    name: 'daily_amount_produced',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  @ApiProperty()
  dailyAmountProduced!: string;

  @Column({
    name: 'daily_ration_consumed',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '1.00',
  })
  @ApiProperty()
  dailyRationConsumed!: string;

  @Column({
    name: 'minimum_required_workers',
    type: 'int',
    default: 1,
  })
  @ApiProperty({ description: 'Mínimo de trabajadores requeridos para esta ocupación', default: 1 })
  minimumRequiredWorkers!: number;

  @Column({
    name: 'preferred_workers',
    type: 'int',
    nullable: true,
  })
  @ApiProperty({ nullable: true, description: 'Cantidad preferida de trabajadores (para optimización)' })
  preferredWorkers!: number | null;

  @Column({
    name: 'critical_threshold_percent',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: '50.00',
  })
  @ApiProperty({ description: 'Porcentaje mínimo de cobertura antes de marcar como crítica (0-100)', default: '50.00' })
  criticalThresholdPercent!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdAt!: Date;
}
