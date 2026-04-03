import { ApiProperty } from '@nestjs/swagger';

export class DecisionTreeSampleDto {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  features!: Record<string, number>;

  @ApiProperty()
  label!: string;
}

export class TrainDecisionTreeDto {
  @ApiProperty()
  modelName!: string;

  @ApiProperty({ type: [String] })
  featureNames!: string[];

  @ApiProperty({ type: [DecisionTreeSampleDto] })
  samples!: DecisionTreeSampleDto[];

  @ApiProperty({ required: false })
  maxDepth?: number;

  @ApiProperty({ required: false })
  minNumSamples?: number;

  @ApiProperty({ required: false, enum: ['gini', 'entropy'] })
  gainFunction?: 'gini' | 'entropy';
}

export class PredictDecisionTreeDto {
  @ApiProperty()
  modelId!: number;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  features!: Record<string, number>;
}

export class ExplainDecisionTreeDto {
  @ApiProperty()
  modelId!: number;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  features!: Record<string, number>;
}

export class DecisionTreeTrainingMetricsDto {
  @ApiProperty()
  sampleCount!: number;

  @ApiProperty()
  featureCount!: number;

  @ApiProperty()
  trainAccuracy!: number;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  labelDistribution!: Record<string, number>;

  @ApiProperty({ required: false, type: [String] })
  labelClasses?: string[];
}

export class DecisionTreeModelDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  modelName!: string;

  @ApiProperty({ type: [String] })
  featureNames!: string[];

  @ApiProperty({ type: DecisionTreeTrainingMetricsDto })
  trainingMetrics!: DecisionTreeTrainingMetricsDto;

  @ApiProperty({ nullable: true, required: false })
  modelFilePath?: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}

export class DecisionTreePredictResultDto {
  @ApiProperty({ type: DecisionTreeModelDto })
  model!: DecisionTreeModelDto;

  @ApiProperty()
  prediction!: string;
}

export class DecisionTreeExplainResultDto {
  @ApiProperty({ type: DecisionTreeModelDto })
  model!: DecisionTreeModelDto;

  @ApiProperty()
  prediction!: string;

  @ApiProperty({ type: [String] })
  rules!: string[];
}
