import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES,
  type OccupationCriteriaEvaluatedField,
} from './occupationAssignmentCriteria.model';

@Entity({ name: 'occupation_assignment_criteria' })
export class OccupationAssignmentCriteriaEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'occupation_id', type: 'int' })
  @ApiProperty()
  occupationId!: number;

  @Column({ name: 'criteria_description', type: 'text' })
  @ApiProperty()
  criteriaDescription!: string;

  @Column({ name: 'evaluated_field', type: 'text' })
  @ApiProperty({ enum: OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES })
  evaluatedField!: OccupationCriteriaEvaluatedField;

  @Column({
    name: 'weight',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: '1.00',
  })
  @ApiProperty()
  weight!: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  @ApiProperty()
  active!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdAt!: Date;
}
