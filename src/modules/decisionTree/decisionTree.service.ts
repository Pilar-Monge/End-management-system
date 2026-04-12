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

const ROLE_MODEL_NAME = 'admission-role-assignment-v1';

type AssignmentRoleName =
  | 'Recolector de agua'
  | 'Recolector de comida'
  | 'Explorador'
  | 'Guardia'
  | 'Medico'
  | 'Ingeniero';

type RoleAssignment = {
  suggestedRole: AssignmentRoleName;
  mappedOccupationName: string;
  modelId: number;
  modelName: string;
  rules: string[];
  summary: string;
  reason: string;
  recommendedAttributes: string[];
};

type RoleProfile = {
  recommendedAttributes: string[];
  reason: string;
};

const ROLE_PROFILES: Record<AssignmentRoleName, RoleProfile> = {
  'Recolector de agua': {
    recommendedAttributes: [
      'condicion fisica alta',
      'salud estable',
      'resistencia al esfuerzo',
      'constancia operativa',
    ],
    reason:
      'el rol exige esfuerzo repetitivo y buena tolerancia fisica para mantener el abastecimiento diario de agua',
  },
  'Recolector de comida': {
    recommendedAttributes: [
      'condicion fisica alta',
      'salud estable',
      'capacidad de trabajo continuo',
      'adaptacion a tareas de campo',
    ],
    reason:
      'el rol necesita produccion y recoleccion constante de alimentos con buena movilidad y resistencia',
  },
  Explorador: {
    recommendedAttributes: [
      'condicion fisica muy alta',
      'buena salud',
      'experiencia en campo',
      'capacidad de adaptacion',
    ],
    reason:
      'el rol requiere desplazamiento, lectura del entorno y tolerancia a condiciones cambiantes',
  },
  Guardia: {
    recommendedAttributes: [
      'condicion fisica alta',
      'salud estable',
      'experiencia',
      'capacidad de vigilancia y reaccion',
    ],
    reason:
      'el rol necesita presencia sostenida, vigilancia y respuesta rapida ante riesgos de seguridad',
  },
  Medico: {
    recommendedAttributes: [
      'salud muy estable',
      'habilidades altas',
      'experiencia',
      'criterio para atencion',
    ],
    reason:
      'el rol se favorece en personas con buenas habilidades y estabilidad para atender a otros de forma segura',
  },
  Ingeniero: {
    recommendedAttributes: [
      'experiencia alta',
      'habilidades altas',
      'salud estable',
      'condicion fisica suficiente',
    ],
    reason:
      'el rol demanda experiencia tecnica, resolucion de problemas y capacidad para mantener infraestructura',
  },
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
    roleAssignment: RoleAssignment;
    explanation: {
      admissionSummary: string;
      roleSummary: string;
      admissionReason: string;
      roleReason: string;
    };
  }> {
    const model = await this.getModelOrThrow(data.modelId);
    const explained = await this.explainWithModel(model, data.features);

    return {
      model: explained.model,
      prediction: explained.prediction,
      roleAssignment: explained.roleAssignment,
      explanation: explained.explanation,
    };
  }

  async explain(data: ExplainDecisionTreeDTO): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
    rules: string[];
    roleAssignment: RoleAssignment;
    explanation: {
      admissionSummary: string;
      roleSummary: string;
      admissionReason: string;
      roleReason: string;
    };
  }> {
    const model = await this.getModelOrThrow(data.modelId);
    return await this.explainWithModel(model, data.features);
  }

  async explainByModelName(
    modelName: string,
    features: Record<string, number>,
  ): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
    rules: string[];
    roleAssignment: RoleAssignment;
    explanation: {
      admissionSummary: string;
      roleSummary: string;
      admissionReason: string;
      roleReason: string;
    };
  }> {
    const model = await this.getActiveModelByNameOrThrow(modelName);
    return await this.explainWithModel(model, features);
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

  private async getActiveModelByNameOrThrow(modelName: string): Promise<DecisionTreeModel> {
    const model = await this.repository.findActiveByModelName(modelName);
    if (!model) {
      throw new Error(`Active decision tree model not found for ${modelName}`);
    }

    return model;
  }

  private async explainWithModel(
    model: DecisionTreeModel,
    features: Record<string, number>,
  ): Promise<{
    model: Omit<DecisionTreeModel, 'modelPayload'>;
    prediction: string;
    rules: string[];
    roleAssignment: RoleAssignment;
    explanation: {
      admissionSummary: string;
      roleSummary: string;
      admissionReason: string;
      roleReason: string;
    };
  }> {
    const row = this.buildSingleRow(model.featureNames, features);

    const { loaded, payload } = await this.loadModelFromModel(model);
    const rawPrediction = loaded.predict([row])[0];
    const prediction = this.decodePrediction(model, rawPrediction);
    const rules = this.extractRulePath(model.featureNames, features, payload, loaded.root);
    const roleAssignment = await this.predictRoleAssignment(features);

    const explanation = {
      admissionSummary: this.buildTreeSummary('Admisión', prediction, rules),
      roleSummary: this.buildRoleSummary(roleAssignment),
      admissionReason: this.buildAdmissionReason(prediction, rules),
      roleReason: roleAssignment.reason,
    };

    return {
      model: this.repository.sanitize(model),
      prediction,
      rules,
      roleAssignment,
      explanation,
    };
  }

  private async predictRoleAssignment(features: Record<string, number>): Promise<RoleAssignment> {
    const roleModel = await this.getActiveModelByNameOrThrow(ROLE_MODEL_NAME);
    const row = this.buildSingleRow(roleModel.featureNames, features);

    const { loaded, payload } = await this.loadModelFromModel(roleModel);
    const rawPrediction = loaded.predict([row])[0];
    const prediction = this.decodePrediction(roleModel, rawPrediction);
    const rules = this.extractRulePath(roleModel.featureNames, features, payload, loaded.root);
    const suggestedRole = this.normalizeRoleLabel(prediction);
    const mappedOccupationName = this.mapRoleToSeedOccupation(suggestedRole);
    const profile = ROLE_PROFILES[suggestedRole];
    const summary = this.buildRoleSummaryText(suggestedRole, rules, profile);

    return {
      suggestedRole,
      mappedOccupationName,
      modelId: roleModel.id,
      modelName: roleModel.modelName,
      rules,
      summary,
      reason: profile.reason,
      recommendedAttributes: profile.recommendedAttributes,
    };
  }

  private async loadModelFromModel(model: DecisionTreeModel): Promise<{
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
    let step = 1;

    while (current && guard < 200) {
      guard += 1;

      const isLeaf = typeof current.category === 'string' || (!current.left && !current.right);
      if (isLeaf) {
        if (current.category) {
          rules.push(`${step}) leaf => ${current.category}`);
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
      const comparison = goesLeft ? '<=' : '>';
      const branch = goesLeft ? 'left' : 'right';

      rules.push(`${step}) ${featureName} (${inputValue}) ${comparison} ${threshold} => ${branch}`);
      step += 1;

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

  private normalizeRoleLabel(roleLabel: string): AssignmentRoleName {
    const normalized = roleLabel.trim().toLowerCase();

    switch (normalized) {
      case 'recolector de agua':
        return 'Recolector de agua';
      case 'recolector de comida':
        return 'Recolector de comida';
      case 'explorador':
        return 'Explorador';
      case 'guardia':
        return 'Guardia';
      case 'medico':
        return 'Medico';
      case 'ingeniero':
        return 'Ingeniero';
      default:
        throw new Error(`Unknown role label returned by the AI model: ${roleLabel}`);
    }
  }

  private mapRoleToSeedOccupation(role: AssignmentRoleName): string {
    switch (role) {
      case 'Recolector de agua':
        return 'Water Collector';
      case 'Recolector de comida':
        return 'Food Gatherer';
      case 'Explorador':
        return 'Scout';
      case 'Guardia':
        return 'Guard';
      case 'Medico':
        return 'Medic';
      case 'Ingeniero':
        return 'Engineer';
      default:
        throw new Error(`Unknown role cannot be mapped to occupation: ${role}`);
    }
  }

  private buildTreeSummary(treeName: string, decision: string, rules: string[]): string {
    const verb = decision === 'ACCEPT' ? 'aprobo' : decision === 'REJECT' ? 'rechazo' : 'clasifico';
    return `${treeName}: el modelo ${verb} la solicitud.`;
  }

  private buildRoleSummary(roleAssignment: RoleAssignment): string {
    return this.buildRoleSummaryText(roleAssignment.suggestedRole, roleAssignment.rules, {
      reason: roleAssignment.reason,
      recommendedAttributes: roleAssignment.recommendedAttributes,
    });
  }

  private buildRoleSummaryText(
    role: AssignmentRoleName,
    rules: string[],
    profile: RoleProfile,
  ): string {
    const occupation = this.mapRoleToSeedOccupation(role);
    const recommended = profile.recommendedAttributes.slice(0, 3).join(', ');
    return `Cargo sugerido: ${role} (${occupation}). Motivo: ${profile.reason}. Recomendado: ${recommended}.`;
  }

  private buildAdmissionReason(decision: string, rules: string[]): string {
    if (rules.length === 0) {
      return 'No fue posible identificar los criterios exactos evaluados por el arbol.';
    }

    const positives = rules.filter((rule) => rule.includes('supera el umbral'));
    const negatives = rules.filter((rule) => rule.includes('no supera el umbral'));

    const concisePositive = rules
      .filter((rule) => rule.includes('=> right'))
      .slice(0, 2)
      .join('; ');
    const conciseNegative = rules
      .filter((rule) => rule.includes('=> left'))
      .slice(0, 2)
      .join('; ');

    if (decision === 'ACCEPT') {
      const reasons = concisePositive || positives.join('; ') || rules.slice(0, 2).join('; ');
      return `Aceptado porque los atributos evaluados cumplieron los umbrales requeridos: ${reasons}.`;
    }

    if (conciseNegative || negatives.length > 0) {
      const reasons = conciseNegative || negatives.join('; ');
      return `Rechazado porque uno o mas atributos quedaron por debajo de lo requerido: ${reasons}.`;
    }

    return `Rechazado por la combinacion de atributos evaluados por el modelo: ${rules.slice(0, 2).join('; ')}.`;
  }
}
