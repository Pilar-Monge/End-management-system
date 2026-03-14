import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES,
  type OccupationCriteriaEvaluatedField,
} from './occupationAssignmentCriteria.model';

@Entity({ name: 'occupation_assignment_criteria' })
export class OccupationAssignmentCriteriaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'occupation_id', type: 'int' })
  occupationId!: number;

  @Column({ name: 'criteria_description', type: 'text' })
  criteriaDescription!: string;

  @Column({ name: 'evaluated_field', type: 'text' })
  evaluatedField!: OccupationCriteriaEvaluatedField;

  @Column({
    name: 'weight',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: '1.00',
  })
  weight!: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;
}
