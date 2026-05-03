import { ForbiddenException } from '@nestjs/common';
import { ExpeditionService } from './expedition.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn().mockResolvedValue(undefined),
}));

const repository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAllAndCount: jest.fn(),
  findByStatuses: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getActiveParticipantPersonIds: jest.fn(),
  findPersonStatusById: jest.fn(),
  getTrackedExpeditionStatusesByPersonId: jest.fn(),
  updatePersonStatus: jest.fn(),
  applyDepartureProvisioningIfNeeded: jest.fn(),
  findActiveParticipantPersonStatus: jest.fn(),
  completeExplorationWithLoot: jest.fn(),
  getAllParticipantPersonIds: jest.fn(),
  findUserIdsByCampAndPersonIds: jest.fn(),
};

const dataSource = {};

const systemTimeService = {
  now: jest.fn(),
};

const notificationService = {
  notifyCampRoles: jest.fn(),
  notifyUsers: jest.fn(),
};

const NOW = new Date('2026-05-15T12:00:00.000Z');

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('ExpeditionService', () => {
  let service: ExpeditionService;

  beforeEach(() => {
    jest.clearAllMocks();
    systemTimeService.now.mockReturnValue(new Date(NOW));
    service = new ExpeditionService(
      repository as never,
      dataSource as never,
      systemTimeService as never,
      notificationService as never,
    );
  });

  // ─── createExpedition ──────────────────────────────────────────────────

  describe('createExpedition', () => {
    it('creates expedition that starts immediately', async () => {
      repository.create.mockResolvedValue({ id: 1, campId: 1, name: 'Exp 1', status: 'IN_PROGRESS' });
      repository.applyDepartureProvisioningIfNeeded.mockResolvedValue(undefined);

      const result = await service.createExpedition({
        campId: 1,
        name: 'Exp 1',
        estimatedDurationDays: 3,
        maxExtraDays: 1,
        // No plannedDepartureDate provided, starts now
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'IN_PROGRESS', extraDaysAvailable: 1 })
      );
      expect(repository.applyDepartureProvisioningIfNeeded).toHaveBeenCalledWith(1, NOW);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('creates PLANNED expedition for future date', async () => {
      const future = new Date(NOW.getTime() + 1000000);
      repository.create.mockResolvedValue({ id: 1, campId: 1, name: 'Exp 2', status: 'PLANNED' });

      await service.createExpedition({
        campId: 1,
        name: 'Exp 2',
        plannedDepartureDate: future,
        estimatedDurationDays: 5,
        maxExtraDays: 0,
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'PLANNED' })
      );
      expect(repository.applyDepartureProvisioningIfNeeded).not.toHaveBeenCalled();
    });

    it('calculates estimated duration from dates if not provided explicitly', async () => {
      const future = new Date(NOW.getTime() + 86400000); // 1 day
      const returnD = new Date(future.getTime() + 3 * 86400000); // +3 days
      repository.create.mockResolvedValue({ id: 1, campId: 1, name: 'Exp 3', status: 'PLANNED' });

      await service.createExpedition({
        campId: 1,
        name: 'Exp 3',
        plannedDepartureDate: future,
        plannedReturnDate: returnD,
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'PLANNED' })
      );
    });

    it('throws if plannedDepartureDate is in the past', async () => {
      const past = new Date(NOW.getTime() - 1000);
      await expect(
        service.createExpedition({
          campId: 1,
          name: 'Past',
          plannedDepartureDate: past,
          estimatedDurationDays: 1,
        })
      ).rejects.toThrow('plannedDepartureDate debe ser la hora actual o futura');
    });
  });

  // ─── getExpeditionById ─────────────────────────────────────────────────

  describe('getExpeditionById', () => {
    it('returns expedition from repository', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      expect(await service.getExpeditionById(1)).toEqual({ id: 1 });
    });
  });

  // ─── getAllExpeditions ─────────────────────────────────────────────────

  describe('getAllExpeditions', () => {
    it('applies pagination and filters', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
      await service.getAllExpeditions({ campId: 1, status: 'PLANNED', page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        campId: 1,
        status: 'PLANNED',
        offset: 5,
        limit: 5,
      });
    });
  });

  // ─── getActiveExplorations ─────────────────────────────────────────────

  describe('getActiveExplorations', () => {
    it('returns active explorations from repository', async () => {
      repository.findByStatuses.mockResolvedValue([{ id: 1 }]);
      const result = await service.getActiveExplorations(2);
      expect(repository.findByStatuses).toHaveBeenCalledWith(['IN_PROGRESS', 'DELAYED'], 2);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  // ─── completeExploration ───────────────────────────────────────────────

  describe('completeExploration', () => {
    it('returns null if expedition not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.completeExploration(1, 1)).toBeNull();
    });

    it('throws if completedBy is invalid', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      await expect(service.completeExploration(1, 0)).rejects.toThrow('Usuario autenticado no valido');
    });

    it('throws if user is not active participant', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      repository.findActiveParticipantPersonStatus.mockResolvedValue(null);
      await expect(service.completeExploration(1, 5)).rejects.toThrow(ForbiddenException);
    });

    it('throws if user is INACTIVE', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      repository.findActiveParticipantPersonStatus.mockResolvedValue({ currentStatus: 'INACTIVE' });
      await expect(service.completeExploration(1, 5)).rejects.toThrow('Las personas inactivas no pueden completar');
    });

    it('throws if trying to complete before estimated return', async () => {
      const future = new Date(NOW.getTime() + 1000);
      repository.findById.mockResolvedValue({ id: 1, plannedReturnDate: future, status: 'IN_PROGRESS' });
      repository.findActiveParticipantPersonStatus.mockResolvedValue({ currentStatus: 'ACTIVE' });
      
      await expect(service.completeExploration(1, 5)).rejects.toThrow('despues de la fecha estimada');
    });

    it('throws if state does not allow completion', async () => {
      const past = new Date(NOW.getTime() - 1000);
      repository.findById.mockResolvedValue({ id: 1, plannedReturnDate: past, status: 'COMPLETED' });
      repository.findActiveParticipantPersonStatus.mockResolvedValue({ currentStatus: 'ACTIVE' });

      await expect(service.completeExploration(1, 5)).rejects.toThrow('no puede completarse desde su estado actual');
    });

    it('completes expedition and notifies', async () => {
      const past = new Date(NOW.getTime() - 1000);
      repository.findById
        .mockResolvedValueOnce({ id: 1, campId: 1, name: 'Exp 1', plannedReturnDate: past, status: 'IN_PROGRESS' }) // first find
        .mockResolvedValueOnce({ id: 1, campId: 1, name: 'Exp 1', status: 'COMPLETED' }); // after save
      repository.findActiveParticipantPersonStatus.mockResolvedValue({ currentStatus: 'ACTIVE' });
      repository.completeExplorationWithLoot.mockResolvedValue(undefined);
      repository.getActiveParticipantPersonIds.mockResolvedValue([]);

      const result = await service.completeExploration(1, 5);

      expect(repository.completeExplorationWithLoot).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        5,
        NOW,
        'COMPLETED'
      );
      expect(result?.status).toBe('COMPLETED');
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  // ─── updateExpedition ──────────────────────────────────────────────────

  describe('updateExpedition', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.updateExpedition(1, {})).toBeNull();
    });

    it('updates fields and provisions if status changes to IN_PROGRESS', async () => {
      repository.findById.mockResolvedValue({ id: 1, status: 'PLANNED', campId: 1 });
      repository.update.mockResolvedValue({ id: 1, status: 'IN_PROGRESS', campId: 1, name: 'Upd' });
      repository.getActiveParticipantPersonIds.mockResolvedValue([]);

      const result = await service.updateExpedition(1, { status: 'IN_PROGRESS' });

      expect(repository.update).toHaveBeenCalled();
      expect(repository.applyDepartureProvisioningIfNeeded).toHaveBeenCalledWith(1, NOW);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(result?.id).toBe(1);
    });

    it('recalculates plannedReturnDate if estimatedDurationDays is provided', async () => {
      const departure = new Date(NOW.getTime() - 100000);
      repository.findById.mockResolvedValue({ id: 1, status: 'PLANNED', campId: 1, plannedDepartureDate: departure });
      repository.update.mockResolvedValue({ id: 1, status: 'PLANNED', campId: 1, name: 'Upd' });

      await service.updateExpedition(1, { estimatedDurationDays: 10 });

      expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining({
        estimatedDurationDays: 10,
        plannedReturnDate: new Date(departure.getTime() + 10 * 86400000)
      }));
    });
  });

  // ─── forceUpdateExpeditionState ────────────────────────────────────────

  describe('forceUpdateExpeditionState', () => {
    it('returns null if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.forceUpdateExpeditionState(1)).toBeNull();
    });

    it('updates to DELAYED and calculates extra days', async () => {
      const past = new Date(NOW.getTime() - 2 * 86400000); // 2 days ago
      repository.findById.mockResolvedValue({
        id: 1,
        campId: 1,
        status: 'IN_PROGRESS',
        plannedDepartureDate: new Date(0),
        plannedReturnDate: past,
        extraDaysAvailable: 5,
        extraDaysUsed: 0,
      });
      repository.update.mockResolvedValue({ id: 1 });
      repository.getActiveParticipantPersonIds.mockResolvedValue([]);

      await service.forceUpdateExpeditionState(1);

      expect(repository.update).toHaveBeenCalledWith(1, {
        status: 'DELAYED',
        extraDaysUsed: 2,
      });
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
    });
  });

  // ─── deleteExpedition ──────────────────────────────────────────────────

  describe('deleteExpedition', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      expect(await service.deleteExpedition(1)).toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1 });
      repository.delete.mockResolvedValue(false);
      expect(await service.deleteExpedition(1)).toBe(false);
    });

    it('deletes and notifies users', async () => {
      repository.findById.mockResolvedValue({ id: 1, campId: 1, name: 'Exp' });
      repository.delete.mockResolvedValue(true);
      repository.getAllParticipantPersonIds.mockResolvedValue([10]);
      repository.findUserIdsByCampAndPersonIds.mockResolvedValue([100]);

      const result = await service.deleteExpedition(1);

      expect(result).toBe(true);
      expect(notificationService.notifyCampRoles).toHaveBeenCalled();
      expect(notificationService.notifyUsers).toHaveBeenCalledWith([100], expect.any(Object));
    });
  });
});
