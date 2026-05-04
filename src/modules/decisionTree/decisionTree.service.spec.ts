import { DecisionTreeService } from './decisionTree.service';
import { DecisionTreeClassifier } from 'ml-cart';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const repository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findActiveByModelName: jest.fn(),
  findActiveGlobalByModelName: jest.fn(),
  deactivateByModelName: jest.fn(),
  create: jest.fn(),
  sanitize: jest.fn().mockImplementation((m: unknown) => m),
};

const MOCK_PAYLOAD = {
  name: 'DTClassifier',
  options: { kind: 'classifier' },
  root: {
    kind: 'classifier',
    splitColumn: 0,
    splitValue: 25,
    left: { kind: 'classifier', distribution: [[1]] }, // predicts 0
    right: { kind: 'classifier', distribution: [[0, 1]] }, // predicts 1
  },
};

const MOCK_ROLE_PAYLOAD = {
  name: 'DTClassifier',
  options: { kind: 'classifier' },
  root: {
    kind: 'classifier',
    splitColumn: 0,
    splitValue: 3,
    left: { kind: 'classifier', distribution: [[1]] }, // predicts 0
    right: { kind: 'classifier', distribution: [[0, 1]] }, // predicts 1
  },
};

const MOCK_MODEL = {
  id: 1,
  campId: 1,
  modelName: 'admission-acceptance-v1',
  featureNames: [
    'age_years',
    'health_level_score',
    'physical_condition_score',
    'experience_years',
    'skills_score',
  ],
  modelPayload: MOCK_PAYLOAD,
  modelFilePath: null,
  isActive: true,
  trainingMetrics: {
    labelClasses: ['REJECT', 'ACCEPT'],
    sampleCount: 10,
    featureCount: 5,
    trainAccuracy: 0.9,
    labelDistribution: { REJECT: 5, ACCEPT: 5 },
  },
};

const MOCK_ROLE_MODEL = {
  id: 2,
  campId: 0,
  modelName: 'admission-role-assignment-v1',
  featureNames: [
    'age_years',
    'health_level_score',
    'physical_condition_score',
    'experience_years',
    'skills_score',
  ],
  modelPayload: MOCK_ROLE_PAYLOAD,
  modelFilePath: null,
  isActive: true,
  trainingMetrics: {
    labelClasses: ['Explorador', 'Guardia'],
    sampleCount: 10,
    featureCount: 5,
    trainAccuracy: 0.85,
    labelDistribution: { Explorador: 5, Guardia: 5 },
  },
};

const SAMPLE_FEATURES = {
  age_years: 30,
  health_level_score: 8,
  physical_condition_score: 9,
  experience_years: 3,
  skills_score: 5,
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('DecisionTreeService', () => {
  let service: DecisionTreeService;

  beforeEach(() => {
    service = new DecisionTreeService(repository as never);
  });

  // ─── validateTrainInput (via trainModel) ─────────────────────────────────

  describe('trainModel - input validation', () => {
    it('throws when modelName is empty', async () => {
      await expect(
        service.trainModel(
          { modelName: '', featureNames: ['a'], samples: [{ features: { a: 1 }, label: 'X' }] },
          1,
        ),
      ).rejects.toThrow('modelName is required');
    });

    it('throws when featureNames is empty', async () => {
      await expect(
        service.trainModel(
          { modelName: 'test', featureNames: [], samples: [{ features: {}, label: 'X' }] },
          1,
        ),
      ).rejects.toThrow('featureNames must contain at least one feature');
    });

    it('throws when samples is empty', async () => {
      await expect(
        service.trainModel({ modelName: 'test', featureNames: ['a'], samples: [] }, 1),
      ).rejects.toThrow('samples must contain at least one row');
    });

    it('throws when a sample has empty label', async () => {
      await expect(
        service.trainModel(
          {
            modelName: 'test',
            featureNames: ['a'],
            samples: [{ features: { a: 1 }, label: '' }],
          },
          1,
        ),
      ).rejects.toThrow('Every sample label must be a non-empty string');
    });

    it('throws when a feature value is not a number', async () => {
      await expect(
        service.trainModel(
          {
            modelName: 'test',
            featureNames: ['a'],
            samples: [{ features: { a: 'not-a-number' as never }, label: 'X' }],
          },
          1,
        ),
      ).rejects.toThrow('Feature "a" must be a valid number');
    });

    it('trains model and stores it in repository', async () => {
      repository.deactivateByModelName.mockResolvedValue(undefined);
      repository.create.mockResolvedValue(MOCK_MODEL);

      const result = await service.trainModel(
        {
          modelName: 'admission-acceptance-v1',
          featureNames: ['age_years'],
          samples: [
            { features: { age_years: 20 }, label: 'REJECT' },
            { features: { age_years: 35 }, label: 'ACCEPT' },
          ],
        },
        1,
      );

      expect(repository.deactivateByModelName).toHaveBeenCalledWith('admission-acceptance-v1', 1);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ id: 1 });
    });
  });

  // ─── getModelById ────────────────────────────────────────────────────────

  describe('getModelById', () => {
    it('returns null when model not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.getModelById(999)).toBeNull();
    });

    it('returns the model when found without campId filter', async () => {
      repository.findById.mockResolvedValue(MOCK_MODEL);
      const result = await service.getModelById(1);
      expect(result).toMatchObject({ id: 1 });
    });

    it('returns null when campId does not match', async () => {
      repository.findById.mockResolvedValue({ ...MOCK_MODEL, campId: 2 });
      const result = await service.getModelById(1, 99);
      expect(result).toBeNull();
    });

    it('returns model when campId matches', async () => {
      repository.findById.mockResolvedValue(MOCK_MODEL);
      const result = await service.getModelById(1, 1);
      expect(result).toMatchObject({ id: 1 });
    });
  });

  // ─── listModels ──────────────────────────────────────────────────────────

  describe('listModels', () => {
    it('returns paginated list with sanitized models', async () => {
      repository.findAll.mockResolvedValue({ data: [MOCK_MODEL], total: 1 });

      const result = await service.listModels({ page: 1, limit: 5 });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(repository.sanitize).toHaveBeenCalledTimes(1);
    });

    it('applies filters correctly', async () => {
      repository.findAll.mockResolvedValue({ data: [], total: 0 });

      await service.listModels({ modelName: 'test', isActive: true, campId: 1 });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ modelName: 'test', isActive: true, campId: 1 }),
      );
    });
  });

  // ─── explainByModelName ──────────────────────────────────────────────────

  describe('explainByModelName', () => {
    it('throws when no active model found and no global model exists', async () => {
      repository.findActiveByModelName.mockResolvedValue(null);
      repository.findActiveGlobalByModelName.mockResolvedValue(null);

      await expect(service.explainByModelName('unknown-model', SAMPLE_FEATURES, 1)).rejects.toThrow(
        'Active decision tree model not found for unknown-model',
      );
    });

    it('uses camp-specific model first', async () => {
      const predictSpy = jest
        .spyOn(DecisionTreeClassifier.prototype, 'predict')
        .mockReturnValueOnce([1]) // 1 is index for ACCEPT in MOCK_MODEL
        .mockReturnValueOnce([0]); // 0 is index for Explorador in MOCK_ROLE_MODEL

      repository.findActiveByModelName
        .mockResolvedValueOnce(MOCK_MODEL) // admission model
        .mockResolvedValueOnce(MOCK_ROLE_MODEL); // role model (called inside predictRoleAssignment)
      repository.findActiveGlobalByModelName.mockResolvedValue(null);

      const result = await service.explainByModelName(
        'admission-acceptance-v1',
        SAMPLE_FEATURES,
        1,
      );

      expect(result.prediction).toBe('ACCEPT');
      expect(result.rules).toBeInstanceOf(Array);
    });

    it('falls back to global model when camp model not found', async () => {
      const predictSpy = jest
        .spyOn(DecisionTreeClassifier.prototype, 'predict')
        .mockReturnValueOnce([1]) // ACCEPT
        .mockReturnValueOnce([0]); // Explorador

      repository.findActiveByModelName
        .mockResolvedValueOnce(null) // camp model not found
        .mockResolvedValueOnce(MOCK_ROLE_MODEL); // role model
      repository.findActiveGlobalByModelName.mockResolvedValueOnce(MOCK_MODEL); // global fallback

      const result = await service.explainByModelName(
        'admission-acceptance-v1',
        SAMPLE_FEATURES,
        1,
      );

      expect(result.prediction).toBeDefined();
    });
  });

  // ─── predict ────────────────────────────────────────────────────────────

  describe('predict', () => {
    it('throws when model not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.predict({ modelId: 999, campId: 1, features: SAMPLE_FEATURES }),
      ).rejects.toThrow('Decision tree model not found');
    });
  });

  // ─── explain ────────────────────────────────────────────────────────────

  describe('explain', () => {
    it('throws when model not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.explain({ modelId: 999, campId: 1, features: SAMPLE_FEATURES }),
      ).rejects.toThrow('Decision tree model not found');
    });
  });
});
