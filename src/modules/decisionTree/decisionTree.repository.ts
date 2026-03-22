import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DecisionTreeEntity } from './decisionTree.entity';
import type { CreateDecisionTreeModelDTO, DecisionTreeModel, DecisionTreeTrainingMetrics } from './decisionTree.model';

@Injectable()
export class DecisionTreeRepository {
  constructor(
    @InjectRepository(DecisionTreeEntity)
    private readonly repo: Repository<DecisionTreeEntity>,
  ) {}

  async create(data: CreateDecisionTreeModelDTO): Promise<DecisionTreeModel> {
    const entity = this.repo.create({
      modelName: data.modelName,
      featureNames: data.featureNames,
      modelPayload: data.modelPayload,
      trainingMetrics: data.trainingMetrics,
      isActive: data.isActive ?? true,
    });

    return await this.repo.save(entity);
  }

  async deactivateByModelName(modelName: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(DecisionTreeEntity)
      .set({ isActive: false })
      .where('model_name = :modelName', { modelName })
      .execute();
  }

  async findById(id: number): Promise<DecisionTreeModel | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findActiveByModelName(modelName: string): Promise<DecisionTreeModel | null> {
    return await this.repo.findOne({
      where: { modelName, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(filters?: {
    modelName?: string;
    isActive?: boolean;
    offset?: number;
    limit?: number;
  }): Promise<{ data: DecisionTreeModel[]; total: number }> {
    const qb = this.repo.createQueryBuilder('model');

    if (filters?.modelName) {
      qb.andWhere('model.modelName = :modelName', { modelName: filters.modelName });
    }

    if (filters?.isActive !== undefined) {
      qb.andWhere('model.isActive = :isActive', { isActive: filters.isActive });
    }

    qb.orderBy('model.createdAt', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  sanitize(model: DecisionTreeModel): Omit<DecisionTreeModel, 'modelPayload'> {
    const metrics = model.trainingMetrics as DecisionTreeTrainingMetrics;

    return {
      id: model.id,
      modelName: model.modelName,
      featureNames: model.featureNames,
      trainingMetrics: metrics,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
