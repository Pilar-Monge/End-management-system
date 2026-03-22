export interface DecisionTreeSampleDTO {
  features: Record<string, number>;
  label: string;
}

export interface TrainDecisionTreeDTO {
  modelName: string;
  featureNames: string[];
  samples: DecisionTreeSampleDTO[];
  maxDepth?: number;
  minNumSamples?: number;
  gainFunction?: 'gini' | 'entropy';
}

export interface PredictDecisionTreeDTO {
  modelId: number;
  features: Record<string, number>;
}

export interface ExplainDecisionTreeDTO {
  modelId: number;
  features: Record<string, number>;
}

export interface DecisionTreeTrainingMetrics {
  sampleCount: number;
  featureCount: number;
  trainAccuracy: number;
  labelDistribution: Record<string, number>;
}

export interface DecisionTreeModel {
  id: number;
  modelName: string;
  featureNames: string[];
  modelPayload: unknown;
  trainingMetrics: DecisionTreeTrainingMetrics;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDecisionTreeModelDTO {
  modelName: string;
  featureNames: string[];
  modelPayload: unknown;
  trainingMetrics: DecisionTreeTrainingMetrics;
  isActive?: boolean;
}
