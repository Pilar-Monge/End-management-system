import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import {
  INVENTORY_MOVEMENT_TYPE_VALUES,
  type InventoryMovementType,
} from './inventoryMovement.model';

@Entity({ name: 'inventory_movement' })
@Index('idx_movimiento_camp_fecha', ['campId', 'date'])
@Index('idx_movimiento_tipo', ['movementType'])
@Index('idx_movimiento_recurso', ['resourceTypeId'])
export class InventoryMovementEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount!: string;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: INVENTORY_MOVEMENT_TYPE_VALUES,
    enumName: 'movement_type_enum',
  })
  movementType!: InventoryMovementType;

  @Column({ name: 'source_id', type: 'int', nullable: true })
  sourceId!: number | null;

  @Column({ name: 'source_type', type: 'text', nullable: true })
  sourceType!: string | null;

  @Column({ name: 'recorded_by', type: 'int' })
  recordedBy!: number;

  @Column({
    name: 'date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  date!: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;
}
