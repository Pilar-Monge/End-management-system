import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as nodePath from 'path';

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
    train: (trainingSet: number[][], labels: number[]) => void;
    predict: (rows: number[][]) => number[];
    toJSON?: () => unknown;
    root?: unknown;
  };
  load?: (json: unknown) => {
    predict: (rows: number[][]) => number[];
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
    const labelClasses = Array.from(new Set(labels));
    const labelToIndex = new Map<string, number>();
    labelClasses.forEach((label, index) => labelToIndex.set(label, index));
    const encodedLabels = labels.map((label) => {
      const index = labelToIndex.get(label);
      if (index === undefined) {
        throw new Error(`Could not encode label "${label}"`);
      }
      return index;
    });

    const classifierOptions: {
      gainFunction?: 'gini' | 'entropy';
      maxDepth?: number;
      minNumSamples?: number;
    } = {
      gainFunction: data.gainFunction ?? 'gini',
    };

    if (data.maxDepth !== undefined) {
      classifierOptions.maxDepth = data.maxDepth;
    }

    if (data.minNumSamples !== undefined) {
      classifierOptions.minNumSamples = data.minNumSamples;
    }

    const classifier = new this.decisionTreeClassifier(classifierOptions);

    classifier.train(rows, encodedLabels);

    const predictions = classifier.predict(rows);
    const hits = predictions.reduce((count, prediction, index) => {
      if (prediction === encodedLabels[index]) return count + 1;
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
        labelClasses,
      },
      isActive: true,
    });
  }

  async trainFromFileIfMissingModel(filePath = 'train.json'): Promise<{
    trained: boolean;
    modelName: string;
  }> {
    const absolutePath = nodePath.resolve(process.cwd(), filePath);
    const raw = await fs.readFile(absolutePath, 'utf8');
    const parsed = JSON.parse(raw) as TrainDecisionTreeDTO;

    this.validateTrainInput(parsed);

    const activeModel = await this.repository.findActiveByModelName(parsed.modelName);
    if (activeModel) {
      return { trained: false, modelName: parsed.modelName };
    }

    const trained = await this.trainModel(parsed);
    return { trained: true, modelName: trained.modelName };
  }

  async predict(data: PredictDecisionTreeDTO): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
  }> {
    const model = await this.getModelOrThrow(data.modelId);
    const row = this.buildSingleRow(model.featureNames, data.features);

    const { loaded, payload } = await this.loadModelFromModel(model);
    const rawPrediction = loaded.predict([row])[0];
    const prediction = this.decodePrediction(model, rawPrediction);

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

    const { loaded, payload } = await this.loadModelFromModel(model);
    const rawPrediction = loaded.predict([row])[0];
    const prediction = this.decodePrediction(model, rawPrediction);
    const rules = this.extractRulePath(model.featureNames, data.features, payload, loaded.root);

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

    const query: {
      modelName?: string;
      isActive?: boolean;
      offset?: number;
      limit?: number;
    } = {
      offset,
      limit,
    };

    if (filters?.modelName !== undefined) {
      query.modelName = filters.modelName;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const result = await this.repository.findAll(query);

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

  private async loadModelFromModel(
    model: DecisionTreeModel,
  ): Promise<{
    loaded: { predict: (rows: number[][]) => number[]; root?: unknown };
    payload: unknown | null;
  }> {
    let payload: unknown | null = null;

    if ((model as any).modelFilePath) {
      try {
        const absolute = nodePath.resolve(process.cwd(), (model as any).modelFilePath as string);
        const raw = await fs.readFile(absolute, 'utf8');
        payload = JSON.parse(raw);
      } catch (err) {
        // fall through to try modelPayload
      }
    }

    if (payload === null && model.modelPayload) {
      payload = model.modelPayload;
    }

    if (payload === null) {
      throw new Error('Model payload not available');
    }

    if (typeof this.decisionTreeClassifier.load !== 'function') {
      throw new Error('Decision tree load() method is not available in installed ml-cart version');
    }

    const loaded = this.decisionTreeClassifier.load(payload);
    return { loaded, payload };
  }

  private decodePrediction(model: DecisionTreeModel, rawPrediction: number | undefined): string {
    if (typeof rawPrediction !== 'number' || Number.isNaN(rawPrediction)) {
      return 'UNKNOWN';
    }

    const classes = model.trainingMetrics?.labelClasses;
    if (Array.isArray(classes) && rawPrediction >= 0 && rawPrediction < classes.length) {
      return classes[rawPrediction] ?? 'UNKNOWN';
    }

    return String(rawPrediction);
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

      const column: number | undefined = current.splitColumn;
      const threshold: number | undefined = current.splitValue;

      if (typeof column !== 'number' || typeof threshold !== 'number') {
        rules.push('Rule node format not recognized');
        break;
      }

      const featureName: string | undefined = featureNames[column];
      if (!featureName) {
        rules.push(`Unknown feature index ${column}`);
        break;
      }

      const rawInputValue: number | undefined = features[featureName];
      if (typeof rawInputValue !== 'number' || Number.isNaN(rawInputValue)) {
        throw new Error(`Feature "${featureName}" must be a valid number`);
      }

      const inputValue: number = rawInputValue;
      const goesLeft: boolean = inputValue <= threshold;
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
