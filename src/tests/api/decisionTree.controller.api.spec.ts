import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DecisionTreeController } from '../../modules/decisionTree/decisionTree.controller';

describe('DecisionTreeController (API controller unit tests)', () => {
  let service: any;
  let controller: DecisionTreeController;

  const makeReq = (campId = 10) =>
    ({ user: { userId: 1, campId, rol: 'SYSTEM_ADMIN' } } as any);

  beforeEach(() => {
    service = {
      trainModel: jest.fn(),
      predict: jest.fn(),
      explain: jest.fn(),
      getModelById: jest.fn(),
      listModels: jest.fn(),
    };
    controller = new DecisionTreeController(service);
  });

  it('train returns mapped data', async () => {
    const model = {
      id: 1,
      modelName: 'model-1',
      featureNames: ['a'],
      trainingMetrics: { accuracy: 0.9 },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    service.trainModel.mockResolvedValue(model);

    const res = await controller.train({} as any, makeReq(5));
    expect(service.trainModel).toHaveBeenCalledWith(expect.anything(), 5);
    expect(res.data).toEqual({
      id: 1,
      modelName: 'model-1',
      featureNames: ['a'],
      trainingMetrics: { accuracy: 0.9 },
      isActive: true,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  });

  it('predict passes campId', async () => {
    service.predict.mockResolvedValue({ prediction: 'ok' });
    const res = await controller.predict({ foo: 1 } as any, makeReq(7));
    expect(service.predict).toHaveBeenCalledWith(expect.objectContaining({ foo: 1, campId: 7 }));
    expect(res).toEqual({
      success: true,
      data: { prediction: 'ok' },
      message: 'Prediction generated successfully',
    });
  });

  it('explain passes campId', async () => {
    service.explain.mockResolvedValue({ explanation: 'ok' });
    const res = await controller.explain({ foo: 1 } as any, makeReq(4));
    expect(service.explain).toHaveBeenCalledWith(expect.objectContaining({ foo: 1, campId: 4 }));
    expect(res).toEqual({
      success: true,
      data: { explanation: 'ok' },
      message: 'Prediction explanation generated successfully',
    });
  });

  it('getModelById rejects invalid id', async () => {
    await expect(controller.getModelById('x', makeReq())).rejects.toThrow(BadRequestException);
  });

  it('getModelById rejects when not found', async () => {
    service.getModelById.mockResolvedValue(null);
    await expect(controller.getModelById('1', makeReq())).rejects.toThrow(NotFoundException);
  });

  it('listModels rejects missing request context', async () => {
    await expect(
      controller.listModels(undefined, undefined, undefined, undefined, undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('listModels rejects invalid isActive', async () => {
    await expect(controller.listModels(undefined, 'maybe', '1', '10', makeReq())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('listModels returns pagination data', async () => {
    service.listModels.mockResolvedValue({ data: [], total: 0 });
    const res = await controller.listModels('m', 'true', '1', '5', makeReq());
    expect(res.pagination).toEqual({ page: 1, limit: 5, total: 0, pages: 0 });
  });
});
