import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AiAdmissionReportController } from './aiAdmissionReport.controller';

describe('AiAdmissionReportController', () => {
  const service = {
    getAdmissionRequestCampId: jest.fn(),
    createReport: jest.fn(),
    getReportCampId: jest.fn(),
    getReportById: jest.fn(),
    getAllReports: jest.fn(),
    updateReport: jest.fn(),
    deleteReport: jest.fn(),
  };

  let controller: AiAdmissionReportController;

  const req = {
    user: { userId: 10, campId: 4, rol: 'SYSTEM_ADMIN' },
  } as never;

  const report = {
    id: 20,
    requestId: 33,
    submittedData: {},
    aiResponse: {},
    aiDecision: 'ACCEPT',
    aiJustification: null,
    suggestedOccupationId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AiAdmissionReportController(service as never);
  });

  it('create rejects when admission request is not in current camp', async () => {
    service.getAdmissionRequestCampId.mockResolvedValue(null);

    await expect(controller.create({ requestId: 1 } as never, req)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('create returns success payload', async () => {
    service.getAdmissionRequestCampId.mockResolvedValue(4);
    service.createReport.mockResolvedValue(report);

    await expect(
      controller.create({ requestId: 33, aiDecision: 'ACCEPT' } as never, req),
    ).resolves.toEqual({
      success: true,
      data: report,
      message: 'AI admission report created successfully',
    });
  });

  it('getById validates id format', async () => {
    await expect(controller.getById('abc', req)).rejects.toThrow(BadRequestException);
  });

  it('getById rejects when report camp does not match', async () => {
    service.getReportCampId.mockResolvedValue(5);

    await expect(controller.getById('20', req)).rejects.toThrow(NotFoundException);
  });

  it('getById returns report data', async () => {
    service.getReportCampId.mockResolvedValue(4);
    service.getReportById.mockResolvedValue(report);

    await expect(controller.getById('20', req)).resolves.toEqual({
      success: true,
      data: report,
    });
  });

  it('getAll validates page and throws BadRequestException', async () => {
    await expect(
      controller.getAll(undefined, undefined, undefined, '0', undefined, req),
    ).rejects.toThrow(BadRequestException);
  });

  it('getAll validates request ownership by camp', async () => {
    service.getAdmissionRequestCampId.mockResolvedValue(9);

    await expect(
      controller.getAll('33', undefined, undefined, undefined, undefined, req),
    ).rejects.toThrow(NotFoundException);
  });

  it('getAll returns data with pagination and filters', async () => {
    service.getAdmissionRequestCampId.mockResolvedValue(4);
    service.getAllReports.mockResolvedValue({ data: [report], total: 7 });

    await expect(controller.getAll('33', 'ACCEPT', '9', '2', '3', req)).resolves.toEqual({
      success: true,
      data: [report],
      pagination: {
        page: 2,
        limit: 3,
        total: 7,
        pages: 3,
      },
    });

    expect(service.getAllReports).toHaveBeenCalledWith({
      campId: 4,
      requestId: 33,
      aiDecision: 'ACCEPT',
      suggestedOccupationId: 9,
      page: 2,
      limit: 3,
    });
  });

  it('update validates requestId camp ownership when provided', async () => {
    service.getReportCampId.mockResolvedValue(4);
    service.getAdmissionRequestCampId.mockResolvedValue(8);

    await expect(controller.update('20', { requestId: 55 } as never, req)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns success payload', async () => {
    service.getReportCampId.mockResolvedValue(4);
    service.getAdmissionRequestCampId.mockResolvedValue(4);
    service.updateReport.mockResolvedValue({ ...report, aiDecision: 'REJECT' });

    await expect(
      controller.update('20', { requestId: 33, aiDecision: 'REJECT' } as never, req),
    ).resolves.toEqual({
      success: true,
      data: { ...report, aiDecision: 'REJECT' },
      message: 'AI admission report updated successfully',
    });
  });

  it('delete rejects reports from another camp', async () => {
    service.getReportCampId.mockResolvedValue(1);

    await expect(controller.delete('20', req)).rejects.toThrow(NotFoundException);
  });

  it('delete returns success message', async () => {
    service.getReportCampId.mockResolvedValue(4);
    service.deleteReport.mockResolvedValue(true);

    await expect(controller.delete('20', req)).resolves.toEqual({
      success: true,
      message: 'AI admission report deleted successfully',
    });
  });
});
