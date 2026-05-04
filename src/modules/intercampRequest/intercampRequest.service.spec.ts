import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IntercampRequestService } from './intercampRequest.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const repository = {
  findCampById: jest.fn(),
  findUserById: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findAllAndCount: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findRequestResourceAmountsByRequestId: jest.fn(),
};

const notificationService = {
  notifyUser: jest.fn(),
  notifyCampRoles: jest.fn(),
};

const transferService = {
  getTransferByRequestId: jest.fn(),
  createTransfer: jest.fn(),
  syncTransferRations: jest.fn(),
};

const transferPersonService = {
  autoAssignGroupForTransfer: jest.fn(),
  canFulfillRequirements: jest.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('IntercampRequestService', () => {
  let service: IntercampRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new IntercampRequestService(
      repository as never,
      notificationService as never,
      transferService as never,
      transferPersonService as never,
    );
  });

  // ─── validateRoutingAndOwnership ───────────────────────────────────────

  // This is a private method but we test its side effects through public ones
  const setupValidRouting = () => {
    repository.findCampById.mockImplementation(async (id) => ({ id }));
    repository.findUserById.mockImplementation(async (id) => {
      if (id === 10) return { id, campId: 1 }; // creator matches origin
      if (id === 20) return { id, campId: 2 }; // responder matches destination
      return null;
    });
  };

  describe('createRequest', () => {
    it('throws if origin and destination are the same', async () => {
      await expect(
        service.createRequest({ originCampId: 1, destinationCampId: 1 } as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws if origin camp not found', async () => {
      repository.findCampById.mockResolvedValueOnce(null);
      await expect(
        service.createRequest({ originCampId: 1, destinationCampId: 2 } as never),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws if creator user camp does not match origin', async () => {
      repository.findCampById.mockResolvedValue({ id: 1 });
      repository.findUserById.mockResolvedValue({ id: 10, campId: 99 });
      await expect(
        service.createRequest({ originCampId: 1, destinationCampId: 2, createdBy: 10 } as never),
      ).rejects.toThrow('El usuario creador no pertenece al campamento de origen');
    });

    it('creates request and notifies on success', async () => {
      setupValidRouting();
      repository.create.mockResolvedValue({
        id: 1,
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
      });

      const result = await service.createRequest({
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
        requestType: 'RESOURCE_REQUEST',
      } as never);

      expect(repository.create).toHaveBeenCalled();
      expect(notificationService.notifyUser).toHaveBeenCalledWith(10, expect.any(Object));
      expect(notificationService.notifyCampRoles).toHaveBeenCalledWith(
        2,
        expect.any(Array),
        expect.any(Object),
      );
      expect(result.id).toBe(1);
    });
  });

  // ─── updateRequest ─────────────────────────────────────────────────────

  describe('updateRequest', () => {
    it('returns null if request not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.updateRequest(1, {})).toBeNull();
    });

    it('validates requirements when approving', async () => {
      setupValidRouting();
      repository.findById.mockResolvedValue({
        id: 1,
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
        personRequirements: [{ count: 5 }],
      });
      repository.update.mockResolvedValue({
        id: 1,
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
        status: 'APPROVED',
        personRequirements: [],
      });
      repository.findRequestResourceAmountsByRequestId.mockResolvedValue([]);
      transferService.getTransferByRequestId.mockResolvedValue({ id: 1 });

      await service.updateRequest(1, { status: 'APPROVED' });

      expect(transferPersonService.canFulfillRequirements).toHaveBeenCalledWith(
        1,
        expect.any(Array),
      );
    });

    it('creates auto-transfer when approved and needs it', async () => {
      setupValidRouting();
      const req = {
        id: 1,
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
        status: 'PENDING',
        personRequirements: [{ count: 2 }],
        plannedDepartureDate: new Date(),
      };
      repository.findById.mockResolvedValue(req);
      repository.update.mockResolvedValue({ ...req, status: 'APPROVED' });

      // Needs transfer
      repository.findRequestResourceAmountsByRequestId.mockResolvedValue([]);
      // Doesn't exist
      transferService.getTransferByRequestId.mockResolvedValue(null);
      transferService.createTransfer.mockResolvedValue({ id: 100 });
      transferPersonService.canFulfillRequirements.mockResolvedValue(true);

      await service.updateRequest(1, { status: 'APPROVED' });

      expect(transferService.createTransfer).toHaveBeenCalled();
      expect(transferPersonService.autoAssignGroupForTransfer).toHaveBeenCalledWith(
        100,
        1,
        expect.any(Array),
      );
      expect(transferService.syncTransferRations).toHaveBeenCalledWith(100);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2); // Origin and Dest
    });

    it('throws if arrival is before departure when creating transfer', async () => {
      setupValidRouting();
      const past = new Date('2026-05-15T10:00:00Z');
      const older = new Date('2026-05-14T10:00:00Z');
      const req = {
        id: 1,
        originCampId: 1,
        destinationCampId: 2,
        createdBy: 10,
        status: 'PENDING',
        personRequirements: [{ count: 2 }],
        plannedDepartureDate: past,
        plannedArrivalDate: older, // Invalid dates
      };
      repository.findById.mockResolvedValue(req);
      repository.update.mockResolvedValue({ ...req, status: 'APPROVED' });
      repository.findRequestResourceAmountsByRequestId.mockResolvedValue([]);
      transferService.getTransferByRequestId.mockResolvedValue(null);
      transferPersonService.canFulfillRequirements.mockResolvedValue(true);

      await expect(service.updateRequest(1, { status: 'APPROVED' })).rejects.toThrow(
        'plannedArrivalDate must be later than plannedDepartureDate',
      );
    });
  });

  // ─── deleteRequest ─────────────────────────────────────────────────────

  describe('deleteRequest', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.deleteRequest(1)).toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      repository.delete.mockResolvedValue(false);
      expect(await service.deleteRequest(1)).toBe(false);
    });

    it('deletes and notifies', async () => {
      repository.findById.mockResolvedValue({ id: 1, originCampId: 1, destinationCampId: 2 });
      repository.delete.mockResolvedValue(true);

      const result = await service.deleteRequest(1);

      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalledTimes(2);
    });
  });
});
