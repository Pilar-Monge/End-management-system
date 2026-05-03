import { TransferHistoryService } from './transferHistory.service';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('TransferHistoryService', () => {
  let service: TransferHistoryService;
  let repository: any;
  let notificationService: any;
  let dataSource: any;

  beforeEach(() => {
    repository = {
      resolveTransferScope: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    notificationService = {
      notifyCampRoles: jest.fn(),
    };
    dataSource = {};
    service = new TransferHistoryService(
      repository as never,
      notificationService as never,
      dataSource as never,
    );
  });

  describe('createEntry', () => {
    it('should create an entry and notify both camps', async () => {
      const entry = { id: 1, transferId: 10, previousStatus: 'PENDING', newStatus: 'COMPLETED' };
      repository.create.mockResolvedValue(entry);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      const result = await service.createEntry({ transferId: 10, userId: 5, previousStatus: 'PENDING', newStatus: 'COMPLETED' } as any);
      
      expect(result).toEqual(entry);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ type: 'TRANSFER_COMPLETED' })
      );
    });
  });

  describe('updateEntry', () => {
    it('should update and notify', async () => {
      const updated = { id: 1, transferId: 10, previousStatus: 'PENDING', newStatus: 'CANCELED' };
      repository.update.mockResolvedValue(updated);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      const result = await service.updateEntry(1, { newStatus: 'CANCELED' });
      expect(result).toEqual(updated);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ type: 'TRANSFER_CANCELED' })
      );
    });
  });

  describe('deleteEntry', () => {
    it('should delete and notify using old entry data', async () => {
      const existing = { id: 1, transferId: 10, previousStatus: 'PENDING', newStatus: 'PENDING' };
      repository.findById.mockResolvedValue(existing);
      repository.delete.mockResolvedValue(true);
      repository.resolveTransferScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });

      const result = await service.deleteEntry(1);
      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });
});
