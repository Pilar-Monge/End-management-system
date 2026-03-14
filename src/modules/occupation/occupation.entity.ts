import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'occupation' })
@Unique('uq_occupation_name', ['name'])
export class OccupationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({
    name: 'collects_resources',
    type: 'boolean',
    default: false,
  })
  collectsResources!: boolean;

  @Column({
    name: 'participates_in_expeditions',
    type: 'boolean',
    default: false,
  })
  participatesInExpeditions!: boolean;

  @Column({ name: 'resource_type_id', type: 'int', nullable: true })
  resourceTypeId!: number | null;

  @Column({
    name: 'daily_amount_produced',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  dailyAmountProduced!: string;

  @Column({
    name: 'daily_ration_consumed',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '1.00',
  })
  dailyRationConsumed!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;
}
