import { Injectable } from '@nestjs/common';

import { DecisionTreeRepository } from './decisionTree.repository';
import type {
  DecisionTreeModel,
  ExplainDecisionTreeDTO,
  PredictDecisionTreeDTO,
  TrainDecisionTreeDTO,
} from './decisionTree.model';

type DecisionTreeCtor = {
  new (options?: {
    gainFunction?: 'gini' | 'entropy';
    maxDepth?: number;
    minNumSamples?: number;
  }): {
    train: (trainingSet: number[][], labels: string[]) => void;
    predict: (rows: number[][]) => string[];
    toJSON?: () => unknown;
    root?: unknown;
  };
  load?: (json: unknown) => {
    predict: (rows: number[][]) => string[];
    root?: unknown;
  };
};

type SerializedTreeNode = {
  splitColumn?: number;
  splitValue?: number;
  left?: SerializedTreeNode;
  right?: SerializedTreeNode;
  category?: string;
};

@Injectable()
export class DecisionTreeService {
  private readonly decisionTreeClassifier: DecisionTreeCtor;

  constructor(private readonly repository: DecisionTreeRepository) {
    const mod = require('ml-cart') as { DecisionTreeClassifier?: DecisionTreeCtor };
    if (!mod.DecisionTreeClassifier) {
      throw new Error('ml-cart DecisionTreeClassifier is not available');
    }

    this.decisionTreeClassifier = mod.DecisionTreeClassifier;
  }

  async trainModel(data: TrainDecisionTreeDTO): Promise<DecisionTreeModel> {
    this.validateTrainInput(data);

    const { rows, labels } = this.buildTrainingRows(data.featureNames, data.samples);
    const classifier = new this.decisionTreeClassifier({
      gainFunction: data.gainFunction ?? 'gini',
      maxDepth: data.maxDepth,
      minNumSamples: data.minNumSamples,
    });

    classifier.train(rows, labels);

    const predictions = classifier.predict(rows);
    const hits = predictions.reduce((count, prediction, index) => {
      if (prediction === labels[index]) return count + 1;
      return count;
    }, 0);

    const accuracy = rows.length === 0 ? 0 : hits / rows.length;
    const labelDistribution: Record<string, number> = {};
    for (const label of labels) {
      labelDistribution[label] = (labelDistribution[label] ?? 0) + 1;
    }

    const modelPayload = typeof classifier.toJSON === 'function' ? classifier.toJSON() : classifier;

    await this.repository.deactivateByModelName(data.modelName);

    return await this.repository.create({
      modelName: data.modelName,
      featureNames: data.featureNames,
      modelPayload,
      trainingMetrics: {
        sampleCount: rows.length,
        featureCount: data.featureNames.length,
        trainAccuracy: Number(accuracy.toFixed(6)),
        labelDistribution,
      },
      isActive: true,
    });
  }

  async predict(data: PredictDecisionTreeDTO): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
  }> {
    const model = await this.getModelOrThrow(data.modelId);
    const row = this.buildSingleRow(model.featureNames, data.features);

    const loaded = this.loadModel(model.modelPayload);
    const prediction = loaded.predict([row])[0] ?? 'UNKNOWN';

    return {
      model: this.repository.sanitize(model),
      prediction,
    };
  }

  async explain(data: ExplainDecisionTreeDTO): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
    rules: string[];
  }> {
    const model = await this.getModelOrThrow(data.modelId);
    const row = this.buildSingleRow(model.featureNames, data.features);

    const loaded = this.loadModel(model.modelPayload);
    const prediction = loaded.predict([row])[0] ?? 'UNKNOWN';
    const rules = this.extractRulePath(model.featureNames, data.features, model.modelPayload, loaded.root);

    return {
      model: this.repository.sanitize(model),
      prediction,
      rules,
    };
  }

  async getModelById(id: number): Promise<DecisionTreeModel | null> {
    return await this.repository.findById(id);
  }

  async listModels(filters?: {
    modelName?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Omit<DecisionTreeModel, 'modelPayload'>[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const result = await this.repository.findAll({
      modelName: filters?.modelName,
      isActive: filters?.isActive,
      offset,
      limit,
    });

    return {
      data: result.data.map((model) => this.repository.sanitize(model)),
      total: result.total,
    };
  }

  private validateTrainInput(data: TrainDecisionTreeDTO): void {
    if (!data.modelName || !data.modelName.trim()) {
      throw new Error('modelName is required');
    }

    if (!Array.isArray(data.featureNames) || data.featureNames.length === 0) {
      throw new Error('featureNames must contain at least one feature');
    }

    if (!Array.isArray(data.samples) || data.samples.length === 0) {
      throw new Error('samples must contain at least one row');
    }
  }

  private buildTrainingRows(
    featureNames: string[],
    samples: { features: Record<string, number>; label: string }[],
  ): { rows: number[][]; labels: string[] } {
    const rows: number[][] = [];
    const labels: string[] = [];

    for (const sample of samples) {
      if (!sample.label || !sample.label.trim()) {
        throw new Error('Every sample label must be a non-empty string');
      }

      rows.push(this.buildSingleRow(featureNames, sample.features));
      labels.push(sample.label.trim());
    }

    return { rows, labels };
  }

  private buildSingleRow(featureNames: string[], features: Record<string, number>): number[] {
    if (!features || typeof features !== 'object') {
      throw new Error('features must be an object with numeric values');
    }

    const row: number[] = [];

    for (const featureName of featureNames) {
      const value = features[featureName];
      if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new Error(`Feature "${featureName}" must be a valid number`);
      }

      row.push(value);
    }

    return row;
  }

  private async getModelOrThrow(id: number): Promise<DecisionTreeModel> {
    const model = await this.repository.findById(id);
    if (!model) {
      throw new Error('Decision tree model not found');
    }

    return model;
  }

  private loadModel(payload: unknown): {
    predict: (rows: number[][]) => string[];
    root?: unknown;
  } {
    if (typeof this.decisionTreeClassifier.load !== 'function') {
      throw new Error('Decision tree load() method is not available in installed ml-cart version');
    }

    return this.decisionTreeClassifier.load(payload);
  }

  private extractRulePath(
    featureNames: string[],
    features: Record<string, number>,
    payload: unknown,
    modelRoot?: unknown,
  ): string[] {
    const payloadRecord = this.asRecord(payload);
    const possibleRoot = modelRoot ?? payloadRecord?.root;
    const root = this.isTreeNode(possibleRoot) ? possibleRoot : null;

    if (!root) {
      return ['Rule path unavailable for this model payload format'];
    }

    const rules: string[] = [];
    let current: SerializedTreeNode | undefined = root;
    let guard = 0;

    while (current && guard < 200) {
      guard += 1;

      const isLeaf = typeof current.category === 'string' || (!current.left && !current.right);
      if (isLeaf) {
        if (current.category) {
          rules.push(`Leaf => ${current.category}`);
        }
        break;
      }

      const column = current.splitColumn;
      const threshold = current.splitValue;

      if (typeof column !== 'number' || typeof threshold !== 'number') {
        rules.push('Rule node format not recognized');
        break;
      }

      const featureName = featureNames[column];
      if (!featureName) {
        rules.push(`Unknown feature index ${column}`);
        break;
      }

      const inputValue = features[featureName];
      const goesLeft = inputValue <= threshold;
      const branch = goesLeft ? 'left' : 'right';

      rules.push(`${featureName} (${inputValue}) <= ${threshold} => ${branch}`);

      current = goesLeft ? current.left : current.right;
    }

    if (rules.length === 0) {
      rules.push('No explainable rules extracted');
    }

    return rules;
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private isTreeNode(value: unknown): value is SerializedTreeNode {
    if (!value || typeof value !== 'object') {
      return false;
    }

    return true;
  }
}
