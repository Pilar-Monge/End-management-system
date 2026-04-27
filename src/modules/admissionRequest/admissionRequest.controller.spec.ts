import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { AdmissionRequestController } from './admissionRequest.controller';

describe('AdmissionRequestController', () => {
  const service = {
    createRequest: jest.fn(),
    getRequestById: jest.fn(),
    getAiFeaturesByRequestId: jest.fn(),
    getAllRequests: jest.fn(),
    updateRequest: jest.fn(),
    processWithAI: jest.fn(),
    reviewByAdmin: jest.fn(),
    getPendingByCamp: jest.fn(),
  };

  let controller: AdmissionRequestController;

  const req = {
    user: { userId: 100, campId: 7, rol: 'SYSTEM_ADMIN' },
  } as never;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdmissionRequestController(service as never);
  });

  it('createRequest returns wrapped success payload', async () => {
    const created = { id: 1, campId: 7 };
    service.createRequest.mockResolvedValue(created);

    await expect(controller.createRequest({ campId: 7 } as never)).resolves.toEqual({
      success: true,
      data: created,
      message: 'Request created successfully',
    });
  });

  it('createRequest wraps service errors as BadRequestException', async () => {
    service.createRequest.mockRejectedValue(new Error('boom'));

    await expect(controller.createRequest({} as never)).rejects.toThrow(BadRequestException);
  });

  it('getRequestById rejects invalid ids', async () => {
    await expect(controller.getRequestById('NaN', req)).rejects.toThrow(BadRequestException);
  });

  it('getRequestById rejects requests from other camp', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 9 });

    await expect(controller.getRequestById('1', req)).rejects.toThrow(NotFoundException);
  });

  it('getAiFeatures returns features for same-camp request', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
    service.getAiFeaturesByRequestId.mockResolvedValue({ age_years: 25 });

    await expect(controller.getAiFeatures('1', req)).resolves.toEqual({
      success: true,
      data: { age_years: 25 },
    });
  });

  it('getAllRequests defaults to authenticated camp and computes pagination', async () => {
    service.getAllRequests.mockResolvedValue({ data: [{ id: 1 }], total: 11 });

    await expect(controller.getAllRequests(undefined, 'PENDING_AI', '2', '5', req)).resolves.toEqual({
      success: true,
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        limit: 5,
        total: 11,
        pages: 3,
      },
    });

    expect(service.getAllRequests).toHaveBeenCalledWith({
      campId: 7,
      status: 'PENDING_AI',
      page: 2,
      limit: 5,
    });
  });

  it('getAllRequests rejects querying another camp', async () => {
    await expect(controller.getAllRequests('8', undefined, undefined, undefined, req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updateRequest rejects moving request to another camp', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });

    await expect(
      controller.updateRequest('1', { campId: 8 } as never, req),
    ).rejects.toThrow(BadRequestException);
  });

  it('processWithAI returns success message with decision', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
    service.processWithAI.mockResolvedValue({ id: 1, status: 'PENDING_ADMIN' });

    await expect(
      controller.processWithAI('1', { oficioSugeridoId: 3, decision: 'ACCEPT' } as never, req),
    ).resolves.toEqual({
      success: true,
      data: { id: 1, status: 'PENDING_ADMIN' },
      message: 'Request processed by AI: ACCEPT',
    });
  });

  it('reviewByAdmin rejects mismatched authenticated admin', async () => {
    await expect(
      controller.reviewByAdmin(
        '1',
        { adminUserId: 999, approved: true } as never,
        req,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('getPendingByCamp returns count and list for same camp', async () => {
    service.getPendingByCamp.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await expect(controller.getPendingByCamp('7', req)).resolves.toEqual({
      success: true,
      data: [{ id: 1 }, { id: 2 }],
      count: 2,
    });
  });

  it('deleteRequest is always forbidden', async () => {
    await expect(controller.deleteRequest('1')).rejects.toThrow(ForbiddenException);
  });
});