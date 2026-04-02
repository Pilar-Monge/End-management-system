import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { TRANSFER_STATUS_VALUES, type TransferStatus } from '../transfer/transfer.model';

@Entity({ name: 'transfer_history' })
@Index('idx_transfer_history', ['transferId', 'date'])
export class TransferHistoryEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  @ApiProperty()
  transferId!: number;

  @Column({
    name: 'previous_status',
    type: 'enum',
    enum: TRANSFER_STATUS_VALUES,
    enumName: 'transfer_status_enum',
  })
  @ApiProperty({ enum: TRANSFER_STATUS_VALUES })
  previousStatus!: TransferStatus;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: TRANSFER_STATUS_VALUES,
    enumName: 'transfer_status_enum',
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
