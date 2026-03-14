import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'evaluated_criteria_report' })
@Unique('uq_reporte_criterio', ['reportId', 'criteriaId'])
@Index('idx_reporte_criterio_reporte', ['reportId'])
@Index('idx_reporte_criterio_criterio', ['criteriaId'])
export class EvaluatedCriteriaReportEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'report_id', type: 'int' })
  reportId!: number;

  @Column({ name: 'criteria_id', type: 'int' })
  criteriaId!: number;

  @Column({ name: 'evaluated_value', type: 'text' })
  evaluatedValue!: string;

  @Column({
    name: 'score_obtained',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  scoreObtained!: string | null;

  @Column({ name: 'observation', type: 'text', nullable: true })
  observation!: string | null;
}
