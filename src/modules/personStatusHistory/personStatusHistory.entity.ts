import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { PERSON_STATUS_VALUES, type PersonStatus } from './personStatusHistory.model';

@Entity({ name: 'person_status_history' })
@Index('idx_person_history', ['personId', 'changeDate'])
@Index('idx_person_history_by', ['changedBy'])
export class PersonStatusHistoryEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'person_id', type: 'int' })
  @ApiProperty()
  personId!: number;

  @Column({
    name: 'previous_status',
    type: 'enum',
    enum: PERSON_STATUS_VALUES,
    enumName: 'person_status_enum',
  })
  @ApiProperty({ enum: PERSON_STATUS_VALUES })
  previousStatus!: PersonStatus;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: PERSON_STATUS_VALUES,
    enumName: 'person_status_enum',
  })
  @ApiProperty({ enum: PERSON_STATUS_VALUES })
  newStatus!: PersonStatus;

  @Column({
    name: 'change_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  changeDate!: Date;

  @Column({ name: 'reason', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  reason!: string | null;

  @Column({ name: 'changed_by', type: 'int' })
  @ApiProperty()
  changedBy!: number;
}
