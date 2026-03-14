import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'camp_inventory' })
export class CampInventoryEntity {
  @PrimaryColumn({ name: 'camp_id', type: 'int' })
  campId!: number;

  @PrimaryColumn({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({
    name: 'current_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: '0.00',
  })
  currentAmount!: string;

  @Column({
    name: 'minimum_alert_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: '0.00',
  })
  minimumAlertAmount!: string;

  @UpdateDateColumn({
    name: 'last_update',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  lastUpdate!: Date;
}
