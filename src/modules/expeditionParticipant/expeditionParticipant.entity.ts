import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  PARTICIPANT_STATUS_VALUES,
  type ParticipantStatus,
} from './expeditionParticipant.model';
@Entity({ name: 'expedition_participant' })
@Unique('uq_expedition_participant', ['expeditionId', 'personId'])
@Index('idx_exp_participant_person', ['personId'])
export class ExpeditionParticipantEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'expedition_id', type: 'int' })
  @ApiProperty()
  expeditionId!: number;

  @Column({ name: 'person_id', type: 'int' })
  @ApiProperty()
  personId!: number;

  @Column({ name: 'expedition_role', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  expeditionRole!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PARTICIPANT_STATUS_VALUES,
    enumName: 'participant_status_enum',
    default: 'ACTIVE',
  })
  @ApiProperty({ enum: PARTICIPANT_STATUS_VALUES })
  status!: ParticipantStatus;

  @Column({
    name: 'assignment_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  assignmentDate!: Date;
}
