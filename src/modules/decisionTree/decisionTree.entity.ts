import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'decision_tree_model' })
export class DecisionTreeEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'model_name', type: 'varchar', length: 120 })
  @ApiProperty()
  modelName!: string;

  @Column({ name: 'feature_names', type: 'jsonb' })
  @ApiProperty({ type: [String] })
  featureNames!: string[];

  @Column({ name: 'model_payload', type: 'jsonb', nullable: true })
  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  modelPayload!: unknown | null;

  @Column({ name: 'model_file_path', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ nullable: true })
  modelFilePath!: string | null;

  @Column({ name: 'training_metrics', type: 'jsonb' })
  @ApiProperty({ type: 'object', additionalProperties: true })
  trainingMetrics!: unknown;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @ApiProperty()
  isActive!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
