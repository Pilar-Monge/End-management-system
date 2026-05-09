import { AiAdmissionReportService } from '../../modules/aiAdmissionReport/aiAdmissionReport.service';
import { NotificationService } from '../../modules/notification/notification.service';
import { OccupationEntity } from '../../modules/occupation/occupation.entity';

describe('AiAdmissionReportService (API service unit tests)', () => {
  let service: AiAdmissionReportService;
  let repository: any;
  let notificationService: any;
  let dataSource: any;
  let occupationRepo: any;

  beforeEach(() => {
    notificationService = {
      notifyCampRoles: jest.fn().mockResolvedValue(undefined),
    };

    occupationRepo = { exist: jest.fn().mockResolvedValue(true) };

    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRequestId: jest.fn(),
      findReportCampId: jest.fn(),
      findAdmissionRequestCampId: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      admissionRequestExists: jest.fn(),
    };

    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === OccupationEntity) return occupationRepo;
        return { exist: jest.fn().mockResolvedValue(true) };
      }),
    };

    service = new AiAdmissionReportService(repository, dataSource as any, notificationService);
  });

  it('createReport creates report when valid', async () => {
    const dto = { requestId: 1, aiDecision: 'APPROVED', suggestedOccupationId: 1 };
    const created = { id: 1, ...dto };
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);
    repository.findAdmissionRequestCampId.mockResolvedValue(1);

    const res = await service.createReport(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('createReport throws when admission request not found', async () => {
    const dto = { requestId: 999, aiDecision: 'APPROVED' };
    repository.admissionRequestExists.mockResolvedValue(false);

    await expect(service.createReport(dto as any)).rejects.toThrow('Solicitud de admision no encontrada');
  });

  it('createReport throws when report already exists for request', async () => {
    const dto = { requestId: 1, aiDecision: 'APPROVED' };
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue({ id: 99, requestId: 1 });

    await expect(service.createReport(dto as any)).rejects.toThrow('Ya existe un reporte de IA');
  });

  it('createReport with suggestedOccupationId that does not exist throws', async () => {
    const dto = { requestId: 1, aiDecision: 'APPROVED', suggestedOccupationId: 999 };
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue(null);
    occupationRepo.exist.mockResolvedValue(false);

    await expect(service.createReport(dto as any)).rejects.toThrow();
  });

  it('getReportById returns report', async () => {
    const report = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(report);

    const res = await service.getReportById(1);
    expect(res).toEqual(report);
  });

  it('getReportById returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.getReportById(999);
    expect(res).toBeNull();
  });

  it('getReportByRequestId returns report', async () => {
    const report = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findByRequestId.mockResolvedValue(report);

    const res = await service.getReportByRequestId(1);
    expect(res).toEqual(report);
  });

  it('getReportByRequestId returns null when not found', async () => {
    repository.findByRequestId.mockResolvedValue(null);

    const res = await service.getReportByRequestId(999);
    expect(res).toBeNull();
  });

  it('getReportCampId returns camp id', async () => {
    repository.findReportCampId.mockResolvedValue(1);

    const res = await service.getReportCampId(1);
    expect(res).toBe(1);
  });

  it('getAdmissionRequestCampId returns camp id', async () => {
    repository.findAdmissionRequestCampId.mockResolvedValue(1);

    const res = await service.getAdmissionRequestCampId(1);
    expect(res).toBe(1);
  });

  it('getAllReports returns paginated reports', async () => {
    const reports = [
      { id: 1, requestId: 1, aiDecision: 'APPROVED' },
      { id: 2, requestId: 2, aiDecision: 'REJECTED' },
    ];
    repository.findAllAndCount.mockResolvedValue({ data: reports, total: 2 });

    const res = await service.getAllReports({ page: 1, limit: 10 });
    expect(res.data).toHaveLength(2);
    expect(res.total).toBe(2);
  });

  it('getAllReports with campId filter', async () => {
    const reports = [{ id: 1, requestId: 1, aiDecision: 'APPROVED' }];
    repository.findAllAndCount.mockResolvedValue({ data: reports, total: 1 });

    const res = await service.getAllReports({ campId: 1, page: 1, limit: 10 });
    expect(res.data).toHaveLength(1);
  });

  it('getAllReports with all filters', async () => {
    const reports = [];
    repository.findAllAndCount.mockResolvedValue({ data: reports, total: 0 });

    const res = await service.getAllReports({
      campId: 1,
      requestId: 1,
      aiDecision: 'APPROVED',
      suggestedOccupationId: 1,
      page: 2,
      limit: 20,
    });
    expect(res.total).toBe(0);
  });

  it('updateReport updates when found', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    const updated = { id: 1, requestId: 1, aiDecision: 'REJECTED' };
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);
    repository.findAdmissionRequestCampId.mockResolvedValue(1);

    const res = await service.updateReport(1, { aiDecision: 'REJECTED' } as any);
    expect(res).toEqual(updated);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('updateReport returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.updateReport(999, {});
    expect(res).toBeNull();
  });

  it('updateReport throws when new requestId not found', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(existing);
    repository.admissionRequestExists.mockResolvedValue(false);

    await expect(service.updateReport(1, { requestId: 999 } as any)).rejects.toThrow('Solicitud de admision no encontrada');
  });

  it('updateReport throws when new requestId already has a report', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    const otherReport = { id: 2, requestId: 2, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(existing);
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue(otherReport);

    await expect(service.updateReport(1, { requestId: 2 } as any)).rejects.toThrow('Ya existe un reporte de IA');
  });

  it('updateReport with new suggestedOccupationId that does not exist throws', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(existing);
    occupationRepo.exist.mockResolvedValue(false);

    await expect(service.updateReport(1, { suggestedOccupationId: 999 } as any)).rejects.toThrow();
  });

  it('deleteReport deletes when found', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue(true);
    repository.findAdmissionRequestCampId.mockResolvedValue(1);

    const res = await service.deleteReport(1);
    expect(res).toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
  });

  it('deleteReport returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);

    const res = await service.deleteReport(999);
    expect(res).toBe(false);
  });

  it('deleteReport returns false when delete fails', async () => {
    const existing = { id: 1, requestId: 1, aiDecision: 'APPROVED' };
    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue(false);

    const res = await service.deleteReport(1);
    expect(res).toBe(false);
  });

  it('createReport with null suggestedOccupationId does not validate', async () => {
    const dto = { requestId: 1, aiDecision: 'APPROVED', suggestedOccupationId: null };
    const created = { id: 1, ...dto };
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);
    repository.findAdmissionRequestCampId.mockResolvedValue(1);

    const res = await service.createReport(dto as any);
    expect(res).toEqual(created);
  });

  it('createReport with campId null does not notify', async () => {
    const dto = { requestId: 1, aiDecision: 'APPROVED' };
    const created = { id: 1, ...dto };
    repository.admissionRequestExists.mockResolvedValue(true);
    repository.findByRequestId.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);
    repository.findAdmissionRequestCampId.mockResolvedValue(null);

    const res = await service.createReport(dto as any);
    expect(res).toEqual(created);
    expect(notificationService.notifyCampRoles).not.toHaveBeenCalled();
  });
});
