import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'decision_tree_model' })
export class DecisionTreeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'model_name', type: 'varchar', length: 120 })
  modelName!: string;

  @Column({ name: 'feature_names', type: 'jsonb' })
  featureNames!: string[];

  @Column({ name: 'model_payload', type: 'jsonb' })
  modelPayload!: unknown;

  @Column({ name: 'training_metrics', type: 'jsonb' })
  trainingMetrics!: unknown;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt!: Date;
}
