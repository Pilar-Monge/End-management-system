import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { TRANSFER_STATUS_VALUES, type TransferStatus } from '../transfer/transfer.model';
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
  @ApiProperty()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  @ApiProperty()
  transferId!: number;

  @Column({
    name: 'previous_status',
    type: 'text',
  })
  @ApiProperty({ enum: TRANSFER_STATUS_VALUES })
  previousStatus!: TransferStatus;

  @Column({
    name: 'new_status',
    type: 'text',
  })
  @ApiProperty({ enum: TRANSFER_STATUS_VALUES })
  newStatus!: TransferStatus;

  @Column({
    name: 'date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  date!: Date;

  @Column({ name: 'user_id', type: 'int' })
  @ApiProperty()
  userId!: number;

  @Column({ name: 'comment', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  comment!: string | null;
}
