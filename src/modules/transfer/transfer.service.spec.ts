import { TransferService } from './transfer.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(undefined),
}));

const repository = {
  findById: jest.fn(),
  findByRequestId: jest.fn(),
  findAllAndCount: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  resolveRequestScope: jest.fn(),
  countTransferPeople: jest.fn(),
  countAppliedTransferMovements: jest.fn(),
  findDeliveredResourcesByTransferId: jest.fn(),
  createTransferHistoryEntry: jest.fn(),
};

const notificationService = {
  notifyCampRoles: jest.fn(),
};

const inventoryMovementService = {
  createMovement: jest.fn(),
};

const dataSource = {
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
  }),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TransferService', () => {
  let service: TransferService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TransferService(
      repository as never,
      notificationService as never,
      inventoryMovementService as never,
      dataSource as never,
    );
  });

  // ─── syncTransferRations ───────────────────────────────────────────────

  describe('syncTransferRations', () => {
    it('returns null if transfer not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.syncTransferRations(1)).toBeNull();
    });

    it('throws if camp not found', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 10 });
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      dataSource.getRepository().findOne.mockResolvedValue(null);

      await expect(service.syncTransferRations(1)).rejects.toThrow(
        'Campamento de origen no encontrado',
      );
    });

    it('sets rations to 0 if dates missing', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 10 }); // no dates
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      dataSource.getRepository().findOne.mockResolvedValue({ minimumDailyRationPerPerson: '1.5' });
      repository.update.mockResolvedValue({ id: 1, rationsForTrip: '0.00' });

      await service.syncTransferRations(1);

      expect(repository.update).toHaveBeenCalledWith(1, { rationsForTrip: '0.00' });
    });

    it('sets rations to 0 if people count is 0', async () => {
      const dep = new Date('2026-05-15T00:00:00Z');
      const arr = new Date('2026-05-16T00:00:00Z');
      repository.findById.mockResolvedValue({
        id: 1,
        requestId: 10,
        plannedDepartureDate: dep,
        plannedArrivalDate: arr,
      });
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      dataSource.getRepository().findOne.mockResolvedValue({ minimumDailyRationPerPerson: '1.5' });
      repository.countTransferPeople.mockResolvedValue(0);
      repository.update.mockResolvedValue({ id: 1, rationsForTrip: '0.00' });

      await service.syncTransferRations(1);

      expect(repository.update).toHaveBeenCalledWith(1, { rationsForTrip: '0.00' });
    });

    it('calculates total rations successfully', async () => {
      const dep = new Date('2026-05-15T00:00:00Z');
      const arr = new Date('2026-05-17T00:00:00Z'); // 2 days diff
      repository.findById.mockResolvedValue({
        id: 1,
        requestId: 10,
        plannedDepartureDate: dep,
        plannedArrivalDate: arr,
      });
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      dataSource.getRepository().findOne.mockResolvedValue({ minimumDailyRationPerPerson: '1.5' });
      repository.countTransferPeople.mockResolvedValue(4);
      repository.update.mockResolvedValue({ id: 1, rationsForTrip: '12.00' });

      await service.syncTransferRations(1);

      // 4 people * 1.5 ration * 2 days = 12
      expect(repository.update).toHaveBeenCalledWith(1, { rationsForTrip: '12.00' });
    });
  });

  // ─── createTransfer ────────────────────────────────────────────────────

  describe('createTransfer', () => {
    it('throws if transfer already exists for request', async () => {
      repository.findByRequestId.mockResolvedValue({ id: 99 });
      await expect(service.createTransfer({ requestId: 1 } as never)).rejects.toThrow(
        'Ya existe un traslado para esta solicitud',
      );
    });

    it('creates transfer, syncs rations and notifies', async () => {
      repository.findByRequestId.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: 1, requestId: 10, status: 'PENDING_DEPARTURE' });
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      dataSource.getRepository().findOne.mockResolvedValue({ minimumDailyRationPerPerson: '1.5' });
      repository.countTransferPeople.mockResolvedValue(0); // to make sync simple

      const result = await service.createTransfer({ requestId: 10 } as never);

      expect(repository.create).toHaveBeenCalled();
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2); // Origin and dest
      expect(result.id).toBe(1);
    });
  });

  // ─── updateTransfer ────────────────────────────────────────────────────

  describe('updateTransfer', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.updateTransfer(1, {})).toBeNull();
    });

    it('throws if completing without approvals', async () => {
      repository.findById.mockResolvedValue({
        id: 1,
        departureApprovedBy: null,
        arrivalApprovedBy: null,
      });
      await expect(service.updateTransfer(1, { status: 'COMPLETED' })).rejects.toThrow(
        'se requieren aprobaciones',
      );
    });

    it('throws if changing request and new request already has a transfer', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 10 });
      repository.findByRequestId.mockResolvedValue({ id: 2 }); // Another transfer exists for 20

      await expect(service.updateTransfer(1, { requestId: 20 })).rejects.toThrow(
        'Ya existe un traslado para esta solicitud',
      );
    });

    it('updates, creates history and applies inventory if COMPLETED', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 10, status: 'PENDING_DEPARTURE' });
      repository.update.mockResolvedValue({
        id: 1,
        requestId: 10,
        status: 'COMPLETED',
        departureApprovedBy: 5,
        arrivalApprovedBy: 5,
      });
      repository.resolveRequestScope.mockResolvedValue({
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 1,
      });
      repository.countAppliedTransferMovements.mockResolvedValue(0);
      repository.findDeliveredResourcesByTransferId.mockResolvedValue([
        { id: 100, resourceTypeId: 50, sentAmount: '10', receivedAmount: '10' },
      ]);
      dataSource.getRepository().findOne.mockResolvedValue({ minimumDailyRationPerPerson: '1.5' });

      await service.updateTransfer(1, {
        status: 'COMPLETED',
        arrivalApprovedBy: 5,
        departureApprovedBy: 5,
      });

      expect(repository.update).toHaveBeenCalled();
      expect(repository.createTransferHistoryEntry).toHaveBeenCalled();
      expect(inventoryMovementService.createMovement).toHaveBeenCalledTimes(2); // Sent and Received
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });

  // ─── deleteTransfer ────────────────────────────────────────────────────

  describe('deleteTransfer', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.deleteTransfer(1)).toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, requestId: 10 });
      repository.resolveRequestScope.mockResolvedValue({ originCampId: 1, destinationCampId: 2 });
      repository.delete.mockResolvedValue(true);

      const result = await service.deleteTransfer(1);

      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });
});
