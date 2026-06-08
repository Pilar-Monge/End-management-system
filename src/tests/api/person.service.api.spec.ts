import { PersonService } from '../../modules/person/person.service';

describe('PersonService (API-focused unit tests)', () => {
  let repository: any;
  let personStatusHistoryRepository: any;
  let notificationService: any;
  let dataSource: any;
  let storageService: any;
  let service: PersonService;

  beforeEach(() => {
    repository = {
      admissionRequestExists: jest.fn(),
      findByIdentificationNumber: jest.fn(),
      findByAdmissionRequestId: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findLinkedUserByPersonAndCamp: jest.fn(),
      findLinkedUserByPersonId: jest.fn(),
    };
    personStatusHistoryRepository = { create: jest.fn() };
    notificationService = { notifyCampRoles: jest.fn(), notifyUser: jest.fn() };
    dataSource = {
      getRepository: jest.fn().mockReturnValue({ exist: jest.fn().mockResolvedValue(true) }),
    };
    storageService = {
      uploadImage: jest.fn().mockResolvedValue('path'),
      deleteImage: jest.fn(),
      getSignedUrl: jest.fn().mockResolvedValue('signed-url'),
    };

    service = new PersonService(
      repository,
      personStatusHistoryRepository,
      notificationService,
      dataSource as any,
      storageService,
    );
  });

  it('createPerson throws when identification exists', async () => {
    repository.findByIdentificationNumber.mockResolvedValue({ id: 1 });
    await expect(
      service.createPerson({ identificationNumber: '123', campId: 1 } as any),
    ).rejects.toThrow();
  });

  it('getPersonWithSignedUrl returns null when not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.getPersonWithSignedUrl(1)).resolves.toBeNull();
  });

  it('getPersonWithSignedUrl returns person with signed url when has image', async () => {
    repository.findById.mockResolvedValue({ id: 2, imageUrl: 'img.png' });
    storageService.getSignedUrl.mockResolvedValue('signed');
    const res = await service.getPersonWithSignedUrl(2);
    expect(res).toHaveProperty('imageSignedUrl', 'signed');
  });

  it('deletePerson returns false when not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.deletePerson(5)).resolves.toBe(false);
  });

  it('deletePerson notifies and returns true when deleted', async () => {
    repository.findById.mockResolvedValue({ id: 6, campId: 1 });
    repository.delete.mockResolvedValue(true);
    repository.findLinkedUserByPersonAndCamp.mockResolvedValue({ id: 7 });
    await expect(service.deletePerson(6)).resolves.toBe(true);
    expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    expect(notificationService.notifyUser).toHaveBeenCalled();
  });
});
