import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'temporary_occupation_assignment' })
@Index('idx_active_person_assignment', ['personId', 'endDate'])
export class TemporaryOccupationAssignmentEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'person_id', type: 'int' })
  @ApiProperty()
  personId!: number;

  @Column({ name: 'temporary_occupation_id', type: 'int' })
  @ApiProperty()
  temporaryOccupationId!: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  endDate!: Date | null;

  @Column({ name: 'reason', type: 'text' })
  @ApiProperty()
  reason!: string;

  @Column({ name: 'assigned_by', type: 'int' })
  @ApiProperty()
  assignedBy!: number;
}
