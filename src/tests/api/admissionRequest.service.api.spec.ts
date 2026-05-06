import { AdmissionRequestService } from '../../modules/admissionRequest/admissionRequest.service';

describe('AdmissionRequestService (API-focused unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let decisionTreeService: any;
  let notificationService: any;
  let systemTimeService: any;
  let storageService: any;
  let service: AdmissionRequestService;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      countByCampAndStatus: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmailAndCamp: jest.fn(),
      create: jest.fn(),
      saveAiAdmissionReport: jest.fn(),
      findOccupationByName: jest.fn(),
    };
    dataSource = { getRepository: jest.fn().mockReturnValue({ exist: jest.fn().mockResolvedValue(true) }) };
    decisionTreeService = { explainByModelName: jest.fn().mockResolvedValue({ prediction: 'ACCEPT', roleAssignment: { mappedOccupationName: 'Farmer', suggestedRole: 'WORKER', rules: [], summary: '', reason: '', recommendedAttributes: {} }, explanation: { admissionSummary: '', admissionReason: '' }, predictionProbability: 0.9, rules: [] }) };
    notificationService = { notifyCampRoles: jest.fn(), queueEmail: jest.fn() };
    systemTimeService = { now: jest.fn().mockReturnValue(new Date()) };
    storageService = {};

    service = new AdmissionRequestService(
      repository,
      dataSource as any,
      decisionTreeService,
      notificationService,
      systemTimeService,
      storageService,
    );
  });

  it('getRequestById returns when found', async () => {
    repository.findById.mockResolvedValue({ id: 1, campId: 1 });
    await expect(service.getRequestById(1)).resolves.toEqual({ id: 1, campId: 1 });
  });

  it('getRequestById throws when not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.getRequestById(99)).rejects.toThrow('Solicitud no encontrada');
  });

  it('getAllRequests returns data and total when no camp/status provided', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    repository.findAll.mockResolvedValue(data);
    const res = await service.getAllRequests({ page: 1, limit: 10 });
    expect(res.data).toBe(data);
    expect(res.total).toBe(data.length);
  });

  it('getAllRequests uses count when campId and status provided', async () => {
    const data = [{ id: 1 }];
    repository.findAll.mockResolvedValue(data);
    repository.countByCampAndStatus.mockResolvedValue(42);
    const res = await service.getAllRequests({ campId: 1, status: 'PENDING', page: 1, limit: 10 });
    expect(res.total).toBe(42);
  });

  it('deleteRequest throws when request not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.deleteRequest(5)).rejects.toThrow('Solicitud no encontrada');
  });

  it('deleteRequest throws when approved', async () => {
    repository.findById.mockResolvedValue({ id: 2, status: 'APPROVED' });
    await expect(service.deleteRequest(2)).rejects.toThrow('No se puede eliminar una solicitud aprobada');
  });

  it('deleteRequest succeeds when delete returns true', async () => {
    repository.findById.mockResolvedValue({ id: 3, status: 'REJECTED' });
    repository.delete.mockResolvedValue(true);
    await expect(service.deleteRequest(3)).resolves.toBeUndefined();
  });
});
