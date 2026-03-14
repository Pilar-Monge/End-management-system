import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import {
  PARTICIPANT_STATUS_VALUES,
  type ParticipantStatus,
} from './expeditionParticipant.model';

@Entity({ name: 'expedition_participant' })
@Unique('uq_expedition_participant', ['expeditionId', 'personId'])
@Index('idx_exp_participant_person', ['personId'])
export class ExpeditionParticipantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'expedition_id', type: 'int' })
  expeditionId!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({ name: 'expedition_role', type: 'text', nullable: true })
  expeditionRole!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PARTICIPANT_STATUS_VALUES,
    enumName: 'participant_status_enum',
    default: 'ACTIVE',
  })
  status!: ParticipantStatus;

  @Column({
    name: 'assignment_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  assignmentDate!: Date;
}
