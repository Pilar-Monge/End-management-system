import { Injectable } from '@nestjs/common';
import type {
  CreateDecisionTreeModelDTO,
  DecisionTreeModel,
  DecisionTreeTrainingMetrics,
} from './decisionTree.model';
import * as fs from 'fs/promises';
import * as nodePath from 'path';

@Injectable()
export class DecisionTreeRepository {
  private readonly modelsDir = nodePath.resolve(process.cwd(), 'data', 'models');
  private readonly indexPath = nodePath.resolve(this.modelsDir, 'models.index.json');

  async create(data: CreateDecisionTreeModelDTO): Promise<DecisionTreeModel> {
    await fs.mkdir(this.modelsDir, { recursive: true });

    let modelFilePath = data.modelFilePath ?? null;
    if (data.modelPayload) {
      const safeName = data.modelName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeName}-${Date.now()}.json`;
      const absoluteFilePath = nodePath.join(this.modelsDir, filename);
      await fs.writeFile(absoluteFilePath, JSON.stringify(data.modelPayload), 'utf8');
      modelFilePath = nodePath.relative(process.cwd(), absoluteFilePath).replace(/\\/g, '/');
    }

    const records = await this.readIndex();
    const nextId = records.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
    const now = new Date().toISOString();

    const record: LocalModelRecord = {
      id: nextId,
      campId: data.campId ?? null,
      modelName: data.modelName,
      featureNames: data.featureNames,
      modelPayload: null,
      modelFilePath,
      trainingMetrics: data.trainingMetrics,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    records.push(record);
    await this.writeIndex(records);

    return this.toModel(record);
  }

  async deactivateByModelName(modelName: string, campId?: number | null): Promise<void> {
    const records = await this.readIndex();
    const now = new Date().toISOString();

    let changed = false;
    for (const record of records) {
      if (
        record.modelName === modelName &&
        record.isActive &&
        (campId === undefined || campId === null || record.campId === campId)
      ) {
        record.isActive = false;
        record.updatedAt = now;
        changed = true;
      }
    }

    if (changed) {
      await this.writeIndex(records);
    }
  }

  async findById(id: number): Promise<DecisionTreeModel | null> {
    const records = await this.readIndex();
    const record = records.find((item) => item.id === id) ?? null;
    return record ? this.toModel(record) : null;
  }

  async findActiveByModelName(
    modelName: string,
    campId?: number | null,
  ): Promise<DecisionTreeModel | null> {
    const records = await this.readIndex();
    const matches = records
      .filter(
        (item) =>
          item.modelName === modelName &&
          item.isActive &&
          (campId === undefined || campId === null || item.campId === campId),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const latest = matches.at(0);
    return latest ? this.toModel(latest) : null;
  }

  async findAll(filters?: {
    modelName?: string;
    isActive?: boolean;
    campId?: number | null;
    offset?: number;
    limit?: number;
  }): Promise<{ data: DecisionTreeModel[]; total: number }> {
    const records = await this.readIndex();

    let filtered = [...records];

    if (filters?.modelName) {
      filtered = filtered.filter((item) => item.modelName === filters.modelName);
    }

    if (filters?.isActive !== undefined) {
      filtered = filtered.filter((item) => item.isActive === filters.isActive);
    }

    if (filters?.campId !== undefined && filters.campId !== null) {
      filtered = filtered.filter((item) => item.campId === filters.campId);
    }

    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = filtered.length;
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? total;
    const paged = filtered.slice(offset, offset + limit);

    return { data: paged.map((item) => this.toModel(item)), total };
  }

  sanitize(model: DecisionTreeModel): Omit<DecisionTreeModel, 'modelPayload'> {
    const metrics = model.trainingMetrics as DecisionTreeTrainingMetrics;

    return {
      id: model.id,
      modelName: model.modelName,
      featureNames: model.featureNames,
      modelFilePath: (model as any).modelFilePath ?? null,
      trainingMetrics: metrics,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private async readIndex(): Promise<LocalModelRecord[]> {
    try {
      const raw = await fs.readFile(this.indexPath, 'utf8');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as LocalModelRecord[];
    } catch {
      return [];
    }
  }

  private async writeIndex(records: LocalModelRecord[]): Promise<void> {
    await fs.mkdir(this.modelsDir, { recursive: true });
    await fs.writeFile(this.indexPath, JSON.stringify(records, null, 2), 'utf8');
  }

  private toModel(entity: LocalModelRecord): DecisionTreeModel {
    return {
      id: entity.id,
      campId: entity.campId ?? null,
      modelName: entity.modelName,
      featureNames: entity.featureNames,
      modelPayload: entity.modelPayload,
      modelFilePath: entity.modelFilePath,
      trainingMetrics: entity.trainingMetrics as DecisionTreeTrainingMetrics,
      isActive: entity.isActive,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt),
    };
  }
}

type LocalModelRecord = {
  id: number;
  campId?: number | null;
  modelName: string;
  featureNames: string[];
  modelPayload: unknown | null;
  modelFilePath: string | null;
  trainingMetrics: DecisionTreeTrainingMetrics;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
