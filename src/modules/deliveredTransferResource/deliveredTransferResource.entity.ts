import { Check, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'delivered_transfer_resource' })
@Unique('uq_transfer_resource_delivered', ['transferId', 'resourceTypeId'])
@Index('idx_transfer_resource_delivered', ['transferId'])
@Check('chk_transfer_resource_sent', `"sent_amount" >= 0`)
@Check('chk_transfer_resource_received', `"received_amount" >= 0`)
export class DeliveredTransferResourceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  transferId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({ name: 'sent_amount', type: 'numeric', precision: 10, scale: 2 })
  sentAmount!: string;

  @Column({
    name: 'received_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  receivedAmount!: string;

  @Column({ name: 'recorded_by', type: 'int' })
  recordedBy!: number;

  @Column({
    name: 'record_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  recordDate!: Date;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  movementId!: number | null;
}
