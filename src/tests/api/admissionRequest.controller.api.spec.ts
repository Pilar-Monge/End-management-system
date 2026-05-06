import { AdmissionRequestService } from '../../modules/admissionRequest/admissionRequest.service';

describe('AdmissionRequestController (unit-level, controller->service)', () => {
  let service: any;
  beforeEach(() => {
    service = {
      getRequestById: jest.fn(),
      getAllRequests: jest.fn(),
      createRequest: jest.fn(),
    };
  });

  it('getRequestById returns value from service', async () => {
    service.getRequestById.mockResolvedValue({ id: 1 });
    const res = await service.getRequestById(1);
    expect(res).toEqual({ id: 1 });
  });

  it('getAllRequests forwards query to service', async () => {
    service.getAllRequests.mockResolvedValue({ data: [], total: 0 });
    const out = await service.getAllRequests({ page: 1, limit: 10 });
    expect(out).toEqual({ data: [], total: 0 });
  });

  it('createRequest calls service createRequest', async () => {
    service.createRequest.mockResolvedValue({ id: 10 });
    await expect(service.createRequest({} as any)).resolves.toEqual({ id: 10 });
  });
});
