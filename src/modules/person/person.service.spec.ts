import { QueryFailedError } from 'typeorm';
import { PersonService } from './person.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(undefined),
}));

const repository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAllAndCount: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  admissionRequestExists: jest.fn(),
  findByIdentificationNumber: jest.fn(),
  findByAdmissionRequestId: jest.fn(),
  findLinkedUserByPersonAndCamp: jest.fn(),
};

const personStatusHistoryRepository = {
  create: jest.fn(),
};

const notificationService = {
  notifyUser: jest.fn(),
  notifyCampRoles: jest.fn(),
};

const dataSource = {};

const storageService = {
  deleteImage: jest.fn(),
  uploadImage: jest.fn(),
  getSignedUrl: jest.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PersonService(
      repository as never,
      personStatusHistoryRepository as never,
      notificationService as never,
      dataSource as never,
      storageService as never,
    );
  });

  // ─── createPerson ──────────────────────────────────────────────────────

  describe('createPerson', () => {
    it('throws if identification number already exists', async () => {
      repository.findByIdentificationNumber.mockResolvedValue({ id: 99 });
      await expect(
        service.createPerson({ campId: 1, identificationNumber: '123' } as never),
      ).rejects.toThrow('A person with this identification number already exists');
    });

    it('throws if admission request does not exist', async () => {
      repository.findByIdentificationNumber.mockResolvedValue(null);
      repository.admissionRequestExists.mockResolvedValue(false);
      await expect(
        service.createPerson({ campId: 1, identificationNumber: '123', admissionRequestId: 5 } as never),
      ).rejects.toThrow('Admission request not found');
    });

    it('throws if person for admission request already exists', async () => {
      repository.findByIdentificationNumber.mockResolvedValue(null);
      repository.admissionRequestExists.mockResolvedValue(true);
      repository.findByAdmissionRequestId.mockResolvedValue({ id: 99 });
      await expect(
        service.createPerson({ campId: 1, identificationNumber: '123', admissionRequestId: 5 } as never),
      ).rejects.toThrow('A person for this admission request already exists');
    });

    it('rethrows friendly error on DB unique constraint failure', async () => {
      repository.findByIdentificationNumber.mockResolvedValue(null);
      
      const error = new QueryFailedError('query', [], new Error());
      (error as any).driverError = { code: '23505', constraint: 'uq_person_identification' };
      repository.create.mockRejectedValue(error);

      await expect(
        service.createPerson({ campId: 1, identificationNumber: '123' } as never),
      ).rejects.toThrow('Ya existe una persona con este numero de identificacion');
    });

    it('creates person successfully', async () => {
      repository.findByIdentificationNumber.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: 1 });

      const result = await service.createPerson({ campId: 1, identificationNumber: '123' } as never);

      expect(repository.create).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });
  });

  // ─── updatePerson ──────────────────────────────────────────────────────

  describe('updatePerson', () => {
    it('returns null if person not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.updatePerson(1, {})).toBeNull();
    });

    it('throws if new identification belongs to another person', async () => {
      repository.findById.mockResolvedValue({ id: 1, identificationNumber: 'old' });
      repository.findByIdentificationNumber.mockResolvedValue({ id: 2 });
      await expect(
        service.updatePerson(1, { identificationNumber: 'new' }),
      ).rejects.toThrow('Another person with this identification number already exists');
    });

    it('creates history and notifies if status changes', async () => {
      repository.findById.mockResolvedValue({ id: 1, currentStatus: 'ACTIVE', campId: 1 });
      repository.update.mockResolvedValue({ id: 1, currentStatus: 'INACTIVE', campId: 1 });
      repository.findLinkedUserByPersonAndCamp.mockResolvedValue({ id: 10 });

      await service.updatePerson(1, { currentStatus: 'INACTIVE' });

      expect(personStatusHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ previousStatus: 'ACTIVE', newStatus: 'INACTIVE' })
      );
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUser).toHaveBeenCalledWith(10, expect.any(Object));
    });
  });

  // ─── deletePerson ──────────────────────────────────────────────────────

  describe('deletePerson', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.deletePerson(1)).toBe(false);
    });

    it('deletes and notifies camp and user', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1 });
      repository.delete.mockResolvedValue(true);
      repository.findLinkedUserByPersonAndCamp.mockResolvedValue({ id: 10 });

      const result = await service.deletePerson(1);

      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUser).toHaveBeenCalledWith(10, expect.objectContaining({ sendEmail: false }));
    });
  });

  // ─── uploadPersonPhoto ─────────────────────────────────────────────────

  describe('uploadPersonPhoto', () => {
    it('throws if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.uploadPersonPhoto(1, {} as never)).rejects.toThrow('Person not found');
    });

    it('deletes old image and uploads new', async () => {
      repository.findById.mockResolvedValue({ id: 1, imageUrl: 'old.png' });
      storageService.uploadImage.mockResolvedValue('new.png');
      repository.update.mockResolvedValue({ id: 1, imageUrl: 'new.png' });

      const result = await service.uploadPersonPhoto(1, {} as never);

      expect(storageService.deleteImage).toHaveBeenCalledWith('old.png');
      expect(storageService.uploadImage).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(1, { imageUrl: 'new.png' });
      expect(result.imageUrl).toBe('new.png');
    });
  });

  // ─── getPersonWithSignedUrl ────────────────────────────────────────────

  describe('getPersonWithSignedUrl', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.getPersonWithSignedUrl(1)).toBeNull();
    });

    it('adds signed url if imageUrl exists', async () => {
      repository.findById.mockResolvedValue({ id: 1, imageUrl: 'img.png' });
      storageService.getSignedUrl.mockResolvedValue('http://signed.url');

      const result = await service.getPersonWithSignedUrl(1);

      expect(result?.imageSignedUrl).toBe('http://signed.url');
    });
  });
});