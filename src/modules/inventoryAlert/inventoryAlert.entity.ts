import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'inventory_alert' })
@Index('idx_alerta_camp_resuelta', ['campId', 'resolved'])
export class InventoryAlertEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({
    name: 'amount_at_alert_generation',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amountAtAlertGeneration!: string;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  movementId!: number | null;

  @Column({
    name: 'alert_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  alertDate!: Date;

  @Column({ name: 'resolved', type: 'boolean', default: false })
  resolved!: boolean;

  @Column({ name: 'resolution_date', type: 'timestamptz', nullable: true })
  resolutionDate!: Date | null;

  @Column({ name: 'resolved_by', type: 'int', nullable: true })
  resolvedBy!: number | null;
}
