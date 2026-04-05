export type DecisionTreeGainFunction = 'gini' | 'entropy';

export type DecisionTreeSample = {
  features: Record<string, number>;
  label: string;
};

export type TrainDecisionTreeDTO = {
  modelName: string;
  featureNames: string[];
  samples: DecisionTreeSample[];
  maxDepth?: number;
  minNumSamples?: number;
  gainFunction?: DecisionTreeGainFunction;
};

export type PredictDecisionTreeDTO = {
  modelId: number;
  features: Record<string, number>;
};

export type ExplainDecisionTreeDTO = {
  modelId: number;
  features: Record<string, number>;
};

export type DecisionTreeTrainingMetrics = {
  sampleCount: number;
  featureCount: number;
  trainAccuracy: number;
  labelDistribution: Record<string, number>;
  labelClasses?: string[];
};

export type DecisionTreeModel = {
  id: number;
  modelName: string;
  featureNames: string[];
  modelPayload: unknown | null;
  modelFilePath: string | null;
  trainingMetrics: DecisionTreeTrainingMetrics;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DecisionTreePredictResult = {
  model: DecisionTreeModel;
  prediction: string;
};

export type DecisionTreeExplainResult = {
  model: DecisionTreeModel;
  prediction: string;
  rules: string[];
};
