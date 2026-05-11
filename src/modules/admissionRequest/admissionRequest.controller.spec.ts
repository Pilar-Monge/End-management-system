import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

import { AdmissionRequestController } from './admissionRequest.controller';

describe('AdmissionRequestController', () => {
  const service = {
    createRequest: jest.fn(),
    getRequestById: jest.fn(),
    getAiFeaturesByRequestId: jest.fn(),
    getAllRequests: jest.fn(),
    getAllAdmissionRequestsWithSignedUrls: jest.fn(),
    getAdmissionRequestWithSignedUrl: jest.fn(),
    uploadAdmissionRequestPhoto: jest.fn(),
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

  it('getRequestById returns data for valid id and same camp', async () => {
    service.getAdmissionRequestWithSignedUrl.mockResolvedValue({ id: 1, campId: 7 });

    await expect(controller.getRequestById('1', req)).resolves.toEqual({
      success: true,
      data: { id: 1, campId: 7 },
    });
  });

  it('getRequestById rejects requests from other camp', async () => {
    service.getAdmissionRequestWithSignedUrl.mockResolvedValue({ id: 1, campId: 9 });

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
    service.getAllAdmissionRequestsWithSignedUrls.mockResolvedValue({
      data: [{ id: 1 }],
      total: 11,
    });

    await expect(
      controller.getAllRequests(undefined, 'PENDING_AI', '2', '5', req),
    ).resolves.toEqual({
      success: true,
      data: [{ id: 1 }],
      pagination: {
        page: 2,
        limit: 5,
        total: 11,
        pages: 3,
      },
    });

    expect(service.getAllAdmissionRequestsWithSignedUrls).toHaveBeenCalledWith({
      campId: 7,
      status: 'PENDING_AI',
      page: 2,
      limit: 5,
    });
  });

  it('getAllRequests rejects querying another camp', async () => {
    await expect(
      controller.getAllRequests('8', undefined, undefined, undefined, req),
    ).rejects.toThrow(BadRequestException);
  });

  describe('uploadPhoto and updatePhoto', () => {
    const mockFile = { mimetype: 'image/jpeg', size: 1024 } as any;

    it('uploadPhoto succeeds for valid file and owner', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
      service.uploadAdmissionRequestPhoto.mockResolvedValue({ id: 1, photoUrl: 'ok' });

      const res = await controller.uploadPhoto('1', mockFile, req);
      expect(res.success).toBe(true);
      expect(res.data.photoUrl).toBe('ok');
    });

    it('uploadPhoto rejects invalid file type', async () => {
      const badFile = { mimetype: 'text/plain', size: 1024 } as any;
      await expect(controller.uploadPhoto('1', badFile, req)).rejects.toThrow(BadRequestException);
    });

    it('updatePhoto succeeds for valid file and owner', async () => {
      service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
      service.uploadAdmissionRequestPhoto.mockResolvedValue({ id: 1, photoUrl: 'updated' });

      const res = await controller.updatePhoto('1', mockFile, req);
      expect(res.success).toBe(true);
      expect(res.data.photoUrl).toBe('updated');
    });
  });

  it('updateRequest rejects moving request to another camp', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });

    await expect(controller.updateRequest('1', { campId: 8 } as never, req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updateRequest succeeds for same camp', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
    service.updateRequest.mockResolvedValue({ id: 1, campId: 7, name: 'new' });

    const res = await controller.updateRequest('1', { name: 'new' } as any, req);
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('new');
  });

  it('processWithAI returns success message with decision', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
    service.processWithAI.mockResolvedValue({ id: 1, status: 'PENDING_ADMIN' });

    await expect(
      controller.processWithAI('1', { oficioSugeridoId: 3, decision: 'ACCEPT' } as never, req),
    ).resolves.toEqual({
      success: true,
      data: { id: 1, status: 'PENDING_ADMIN' },
      message: 'AI recommendation recorded: ACCEPT. Request pending admin review.',
    });
  });

  it('reviewByAdmin rejects mismatched authenticated admin', async () => {
    await expect(
      controller.reviewByAdmin('1', { adminUserId: 999, approved: true } as never, req),
    ).rejects.toThrow(BadRequestException);
  });

  it('reviewByAdmin succeeds for valid owner and same camp', async () => {
    service.getRequestById.mockResolvedValue({ id: 1, campId: 7 });
    service.reviewByAdmin.mockResolvedValue({ id: 1, status: 'APPROVED' });

    const res = await controller.reviewByAdmin(
      '1',
      { adminUserId: 100, approved: true, finalOccupationId: 10, finalRole: 'TRAVEL_MANAGER' } as any,
      req,
    );
    expect(res.success).toBe(true);
    expect(res.data.status).toBe('APPROVED');
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
