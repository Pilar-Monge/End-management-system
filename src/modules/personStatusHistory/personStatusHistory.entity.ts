import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { PERSON_STATUS_VALUES, type PersonStatus } from './personStatusHistory.model';

@Entity({ name: 'person_status_history' })
@Index('idx_person_history', ['personId', 'changeDate'])
@Index('idx_person_history_by', ['changedBy'])
export class PersonStatusHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({
    name: 'previous_status',
    type: 'enum',
    enum: PERSON_STATUS_VALUES,
    enumName: 'person_status_enum',
  })
  previousStatus!: PersonStatus;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: PERSON_STATUS_VALUES,
    enumName: 'person_status_enum',
  })
  newStatus!: PersonStatus;

  @Column({
    name: 'change_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  changeDate!: Date;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason!: string | null;

  @Column({ name: 'changed_by', type: 'int' })
  changedBy!: number;
}
