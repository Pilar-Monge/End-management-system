import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpeditionParticipantService } from './expeditionParticipant.service';
import type { ExpeditionParticipantRepository } from './expeditionParticipant.repository';
import type { NotificationService } from '../notification/notification.service';

describe('ExpeditionParticipantService', () => {
  let service: ExpeditionParticipantService;

  const repository = {
    findExpeditionCampId: jest.fn(),
    findParticipantCampId: jest.fn(),
    findPersonStatusById: jest.fn(),
    hasActiveParticipationInExpeditionStatuses: jest.fn(),
    updatePersonStatus: jest.fn(),
    findExpeditionSummaryById: jest.fn(),
    findPersonById: jest.fn(),
    findOccupationById: jest.fn(),
    findByExpeditionAndPerson: jest.fn(),
    create: jest.fn(),
    findUserByPersonId: jest.fn(),
    findUserByPersonAndCamp: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ExpeditionParticipantRepository>;

  const notificationService = {
    notifyUser: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ExpeditionParticipantService(repository, notificationService);
  });

  describe('assertExpeditionCampAccess', () => {
    it('throws NotFoundException if expedition does not exist', async () => {
      repository.findExpeditionCampId.mockResolvedValue(null);
      await expect(service.assertExpeditionCampAccess(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException if camp mismatch', async () => {
      repository.findExpeditionCampId.mockResolvedValue(2);
      await expect(service.assertExpeditionCampAccess(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('passes if camp matches', async () => {
      repository.findExpeditionCampId.mockResolvedValue(1);
      await expect(service.assertExpeditionCampAccess(1, 1)).resolves.toBeUndefined();
    });
  });

  describe('assertParticipantCampAccess', () => {
    it('throws NotFoundException if participant does not exist', async () => {
      repository.findParticipantCampId.mockResolvedValue(null);
      await expect(service.assertParticipantCampAccess(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException if camp mismatch', async () => {
      repository.findParticipantCampId.mockResolvedValue(2);
      await expect(service.assertParticipantCampAccess(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('passes if camp matches', async () => {
      repository.findParticipantCampId.mockResolvedValue(1);
      await expect(service.assertParticipantCampAccess(1, 1)).resolves.toBeUndefined();
    });
  });

  describe('createParticipant', () => {
    const validDto = { expeditionId: 1, personId: 1, status: 'ACTIVE' as const };
    const validExpedition = { id: 1, campId: 1, status: 'PLANNED', name: 'Exp 1' };
    const validPerson = { id: 1, campId: 1, currentStatus: 'ACTIVE', occupationId: 1 };
    const validOccupation = { id: 1, name: 'Explorer', participatesInExpeditions: true };

    it('throws BadRequestException if expeditionId is invalid', async () => {
      await expect(service.createParticipant({ ...validDto, expeditionId: 0 })).rejects.toThrow(
        'expeditionId debe ser un entero positivo',
      );
    });

    it('throws NotFoundException if expedition not found', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(null);
      await expect(service.createParticipant(validDto)).rejects.toThrow('Expedicion no encontrada');
    });

    it('throws BadRequestException if expedition is not PLANNED', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue({
        ...validExpedition,
        status: 'IN_PROGRESS',
      } as never);
      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'Solo las expediciones planificadas pueden recibir nuevos participantes',
      );
    });

    it('throws NotFoundException if person not found', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue(null);
      await expect(service.createParticipant(validDto)).rejects.toThrow('Persona no encontrada');
    });

    it('throws BadRequestException if person is INACTIVE', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue({
        ...validPerson,
        currentStatus: 'INACTIVE',
      } as never);
      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'Las personas inactivas no pueden asignarse a expediciones',
      );
    });

    it('throws BadRequestException if person camp mismatches', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue({ ...validPerson, campId: 2 } as never);
      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'La persona no pertenece al mismo campamento que la expedicion',
      );
    });

    it('throws BadRequestException if person has no occupation', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue({ ...validPerson, occupationId: null } as never);
      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'La persona debe tener una ocupacion asignada',
      );
    });

    it('throws BadRequestException if occupation does not participate in expeditions', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue(validPerson as never);
      repository.findOccupationById.mockResolvedValue({
        ...validOccupation,
        participatesInExpeditions: false,
      } as never);
      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'no esta habilitada para participar en expediciones',
      );
    });

    it('throws BadRequestException if participant already exists', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue(validPerson as never);
      repository.findOccupationById.mockResolvedValue(validOccupation as never);
      repository.findByExpeditionAndPerson.mockResolvedValue({ id: 1 } as never);

      await expect(service.createParticipant(validDto)).rejects.toThrow(
        'Este participante de expedicion ya existe',
      );
    });

    it('creates participant successfully and sends notification', async () => {
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue(validPerson as never);
      repository.findOccupationById.mockResolvedValue(validOccupation as never);
      repository.findByExpeditionAndPerson.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: 1, ...validDto } as never);
      repository.findUserByPersonId.mockResolvedValue({ id: 10, campId: 1 } as never);

      const result = await service.createParticipant(validDto);

      expect(result).toEqual({ id: 1, ...validDto });
      expect(repository.create).toHaveBeenCalledWith(validDto);
      expect(notificationService.notifyUser).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          type: 'EXPEDITION_RETURN',
        }),
      );
    });
  });

  describe('updateParticipant', () => {
    const validExpedition = { id: 1, campId: 1, status: 'PLANNED', name: 'Exp 1' };
    const validPerson = { id: 1, campId: 1, currentStatus: 'ACTIVE', occupationId: 1 };
    const validOccupation = { id: 1, name: 'Explorer', participatesInExpeditions: true };

    it('returns null if participant not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateParticipant(1, {})).resolves.toBeNull();
    });

    it('updates participant and notifies user', async () => {
      const existing = { id: 1, expeditionId: 1, personId: 1, status: 'ACTIVE' };
      repository.findById.mockResolvedValue(existing as never);
      repository.findExpeditionSummaryById.mockResolvedValue(validExpedition as never);
      repository.findPersonById.mockResolvedValue(validPerson as never);
      repository.findOccupationById.mockResolvedValue(validOccupation as never);
      repository.update.mockResolvedValue({ ...existing, status: 'INJURED' } as never);
      repository.findUserByPersonAndCamp.mockResolvedValue({ id: 10 } as never);

      const result = await service.updateParticipant(1, { status: 'INJURED' });

      expect(result?.status).toBe('INJURED');
      expect(notificationService.notifyUser).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          type: 'EXPEDITION_STATUS_UPDATED',
        }),
      );
    });
  });

  describe('deleteParticipant', () => {
    it('returns false if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteParticipant(1)).resolves.toBe(false);
    });

    it('returns false if delete fails', async () => {
      repository.findById.mockResolvedValue({ id: 1, expeditionId: 1, personId: 1 } as never);
      repository.delete.mockResolvedValue(false);
      await expect(service.deleteParticipant(1)).resolves.toBe(false);
    });

    it('deletes participant and sends notification', async () => {
      repository.findById.mockResolvedValue({ id: 1, expeditionId: 1, personId: 1 } as never);
      repository.delete.mockResolvedValue(true);
      repository.findExpeditionSummaryById.mockResolvedValue({
        id: 1,
        campId: 1,
        name: 'Exp 1',
      } as never);
      repository.findUserByPersonAndCamp.mockResolvedValue({ id: 10 } as never);

      await expect(service.deleteParticipant(1)).resolves.toBe(true);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(notificationService.notifyUser).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          title: 'Participacion en expedicion eliminada',
        }),
      );
    });
  });

  describe('getAllParticipants', () => {
    it('fetches participants with pagination', async () => {
      repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

      await service.getAllParticipants({ page: 2, limit: 5 });

      expect(repository.findAllAndCount).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
      });
    });
  });
});
