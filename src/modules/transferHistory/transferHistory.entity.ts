import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { TRANSFER_STATUS_VALUES, type TransferStatus } from '../transfer/transfer.model';

@Entity({ name: 'transfer_history' })
@Index('idx_transfer_history', ['transferId', 'date'])
export class TransferHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  transferId!: number;

  @Column({
    name: 'previous_status',
    type: 'enum',
    enum: TRANSFER_STATUS_VALUES,
    enumName: 'transfer_status_enum',
  })
  previousStatus!: TransferStatus;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: TRANSFER_STATUS_VALUES,
    enumName: 'transfer_status_enum',
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
