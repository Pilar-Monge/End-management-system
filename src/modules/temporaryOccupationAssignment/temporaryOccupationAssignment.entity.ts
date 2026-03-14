import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'temporary_occupation_assignment' })
@Index('idx_active_person_assignment', ['personId', 'endDate'])
export class TemporaryOccupationAssignmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({ name: 'temporary_occupation_id', type: 'int' })
  temporaryOccupationId!: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'reason', type: 'text' })
  reason!: string;

  @Column({ name: 'assigned_by', type: 'int' })
  assignedBy!: number;
}
