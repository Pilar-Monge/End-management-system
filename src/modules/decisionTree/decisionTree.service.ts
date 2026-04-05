import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DecisionTreeEntity } from './decisionTree.entity';
import type {
  DecisionTreeExplainResult,
  DecisionTreeModel,
  DecisionTreePredictResult,
  DecisionTreeTrainingMetrics,
  ExplainDecisionTreeDTO,
  PredictDecisionTreeDTO,
  TrainDecisionTreeDTO,
} from './decisionTree.model';

type StoredPayload = {
  majorityLabel: string;
};

@Injectable()
export class DecisionTreeService {
  constructor(private readonly dataSource: DataSource) {}

  private repo() {
    return this.dataSource.getRepository(DecisionTreeEntity);
  }

  async trainModel(data: TrainDecisionTreeDTO): Promise<DecisionTreeEntity> {
    const labelDistribution: Record<string, number> = {};

    for (const sample of data.samples) {
      labelDistribution[sample.label] = (labelDistribution[sample.label] ?? 0) + 1;
    }

    const labelClasses = Object.keys(labelDistribution).sort();

    const majorityLabel =
      labelClasses.reduce(
        (best, current) =>
          (labelDistribution[current] ?? 0) > (labelDistribution[best] ?? 0) ? current : best,
        labelClasses[0] ?? 'UNKNOWN',
      ) ?? 'UNKNOWN';

    const sampleCount = data.samples.length;
    const correct = data.samples.filter((s) => s.label === majorityLabel).length;
    const trainAccuracy = sampleCount > 0 ? correct / sampleCount : 0;

    const trainingMetrics: DecisionTreeTrainingMetrics = {
      sampleCount,
      featureCount: data.featureNames.length,
      trainAccuracy,
      labelDistribution,
      labelClasses,
    };

    const modelPayload: StoredPayload = {
      majorityLabel,
    };

    const entity = this.repo().create({
      modelName: data.modelName,
      featureNames: data.featureNames,
      modelPayload,
      modelFilePath: null,
      trainingMetrics,
      isActive: true,
    });

    return await this.repo().save(entity);
  }

  async predict(data: PredictDecisionTreeDTO): Promise<DecisionTreePredictResult> {
    const model = await this.getModelById(data.modelId);
    if (!model) {
      throw new NotFoundException('Decision tree model not found');
    }

    const payload = (model.modelPayload ?? null) as StoredPayload | null;
    const prediction = payload?.majorityLabel ?? 'UNKNOWN';

    return {
      model: this.toModel(model),
      prediction,
    };
  }

  async explain(data: ExplainDecisionTreeDTO): Promise<DecisionTreeExplainResult> {
    const model = await this.getModelById(data.modelId);
    if (!model) {
      throw new NotFoundException('Decision tree model not found');
    }

    const payload = (model.modelPayload ?? null) as StoredPayload | null;
    const prediction = payload?.majorityLabel ?? 'UNKNOWN';

    return {
      model: this.toModel(model),
      prediction,
      rules: [`Default prediction (majority class): ${prediction}`],
    };
  }

  async getModelById(id: number): Promise<DecisionTreeEntity | null> {
    return await this.repo().findOne({ where: { id } });
  }

  async listModels(filters?: {
    modelName?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: DecisionTreeEntity[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const qb = this.repo().createQueryBuilder('m');

    if (filters?.modelName) {
      qb.andWhere('m.modelName ILIKE :modelName', { modelName: `%${filters.modelName}%` });
    }

    if (filters?.isActive !== undefined) {
      qb.andWhere('m.isActive = :isActive', { isActive: filters.isActive });
    }

    qb.orderBy('m.createdAt', 'DESC').skip(offset).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  private toModel(entity: DecisionTreeEntity): DecisionTreeModel {
    return {
      id: entity.id,
      modelName: entity.modelName,
      featureNames: entity.featureNames,
      modelPayload: entity.modelPayload,
      modelFilePath: entity.modelFilePath,
      trainingMetrics: entity.trainingMetrics as DecisionTreeTrainingMetrics,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
