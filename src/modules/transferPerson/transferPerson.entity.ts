import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import {
  PERSON_TRANSFER_STATUS_VALUES,
  type PersonTransferStatus,
} from './transferPerson.model';

@Entity({ name: 'transfer_person' })
@Unique('uq_transfer_person', ['transferId', 'personId'])
@Index('idx_transfer_person_transfer', ['transferId'])
@Index('idx_transfer_person_person', ['personId'])
export class TransferPersonEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'transfer_id', type: 'int' })
  transferId!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PERSON_TRANSFER_STATUS_VALUES,
    enumName: 'person_transfer_status_enum',
    default: 'CONFIRMED',
  })
  status!: PersonTransferStatus;

  @Column({ name: 'departure_date', type: 'timestamptz', nullable: true })
  departureDate!: Date | null;

  @Column({ name: 'arrival_date', type: 'timestamptz', nullable: true })
  arrivalDate!: Date | null;
}
