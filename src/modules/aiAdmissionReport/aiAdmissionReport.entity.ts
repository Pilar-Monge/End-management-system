import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { AI_DECISION_VALUES, type AiDecision } from './aiAdmissionReport.model';

@Entity({ name: 'ai_admission_report' })
@Unique('uq_reporte_por_solicitud', ['requestId'])
export class AiAdmissionReportEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'request_id', type: 'int' })
  @ApiProperty()
  requestId!: number;

  @Column({ name: 'submitted_data', type: 'jsonb' })
  @ApiProperty({ type: 'object', additionalProperties: true })
  submittedData!: unknown;

  @Column({ name: 'ai_response', type: 'jsonb' })
  @ApiProperty({ type: 'object', additionalProperties: true })
  aiResponse!: unknown;

  @Column({
    name: 'ai_decision',
    type: 'enum',
    enum: AI_DECISION_VALUES,
    enumName: 'ai_decision_enum',
  })
  @ApiProperty({ enum: AI_DECISION_VALUES })
  aiDecision!: AiDecision;

  @Column({ name: 'ai_justification', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  aiJustification!: string | null;

  @Column({ name: 'suggested_occupation_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  suggestedOccupationId!: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdAt!: Date;
}
