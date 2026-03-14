import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { TRANSFER_STATUS_VALUES, type TransferStatus } from './transfer.model';

@Entity({ name: 'transfer' })
@Unique('uq_transfer_request', ['requestId'])
@Index('idx_transfer_status', ['status'])
@Index('idx_transfer_request', ['requestId'])
@Check(
  'chk_transfer_dates',
  `"planned_arrival_date" > "planned_departure_date"`,
)
@Check('chk_transfer_rations', `"rations_for_trip" >= 0`)
export class TransferEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'request_id', type: 'int' })
  requestId!: number;

  @Column({ name: 'planned_departure_date', type: 'timestamptz' })
  plannedDepartureDate!: Date;

  @Column({ name: 'actual_departure_date', type: 'timestamptz', nullable: true })
  actualDepartureDate!: Date | null;

  @Column({ name: 'planned_arrival_date', type: 'timestamptz' })
  plannedArrivalDate!: Date;

  @Column({ name: 'actual_arrival_date', type: 'timestamptz', nullable: true })
  actualArrivalDate!: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TRANSFER_STATUS_VALUES,
    enumName: 'transfer_status_enum',
    default: 'PENDING_DEPARTURE',
  })
  status!: TransferStatus;

  @Column({ name: 'departure_approved_by', type: 'int', nullable: true })
  departureApprovedBy!: number | null;

  @Column({ name: 'arrival_approved_by', type: 'int', nullable: true })
  arrivalApprovedBy!: number | null;

  @Column({
    name: 'rations_for_trip',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  rationsForTrip!: string;

  @Column({ name: 'reception_notes', type: 'text', nullable: true })
  receptionNotes!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt!: Date;
}
