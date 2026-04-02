import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { type TransferStatus } from '../transfer/transfer.model';

@Entity({ name: 'transfer_history' })
@Index('idx_transfer_history', ['transferId', 'date'])
@Check(
  'chk_transfer_history_previous_status_values',
  `"previous_status" IN ('PENDING_DEPARTURE','COMPLETED','CANCELED')`,
)
@Check(
  'chk_transfer_history_new_status_values',
  `"new_status" IN ('PENDING_DEPARTURE','COMPLETED','CANCELED')`,
)
export class TransferHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  transferId!: number;

  @Column({
    name: 'previous_status',
    type: 'text',
  })
  previousStatus!: TransferStatus;

  @Column({
    name: 'new_status',
    type: 'text',
  })
  newStatus!: TransferStatus;

  @Column({
    name: 'date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  date!: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment!: string | null;
}
