import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PersonStatusHistoryController } from './personStatusHistory.controller';
import { PersonStatusHistoryService } from './personStatusHistory.service';

describe('PersonStatusHistoryController', () => {
  let controller: PersonStatusHistoryController;
  let service: jest.Mocked<PersonStatusHistoryService>;

  beforeEach(() => {
    service = {
      createEntry: jest.fn(),
      getEntryById: jest.fn(),
      getAllEntries: jest.fn(),
      updateEntry: jest.fn(),
      deleteEntry: jest.fn(),
    } as any;
    controller = new PersonStatusHistoryController(service);
  });

  describe('create', () => {
    it('should create an entry successfully', async () => {
      const body = {
        personId: 1,
        previousStatus: 'ACTIVE',
        newStatus: 'INACTIVE',
        changedBy: 5,
      } as any;
      service.createEntry.mockResolvedValue({ id: 10, ...body });

      const result = await controller.create(body);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(10);
      expect(service.createEntry).toHaveBeenCalledWith(body);
    });

    it('should throw BadRequestException on service error', async () => {
      service.createEntry.mockRejectedValue(new Error('Test error'));
      await expect(controller.create({} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should return an entry', async () => {
      service.getEntryById.mockResolvedValue({ id: 10 } as any);
      const result = await controller.getById('10');
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(10);
    });

    it('should throw BadRequestException if id is missing', async () => {
      await expect(controller.getById(undefined as any)).rejects.toThrow('Invalid ID');
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(controller.getById('abc')).rejects.toThrow('Invalid ID');
    });

    it('should throw NotFoundException if entry not found', async () => {
      service.getEntryById.mockResolvedValue(null);
      await expect(controller.getById('10')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return paginated results', async () => {
      service.getAllEntries.mockResolvedValue({ data: [], total: 0 });
      const result = await controller.getAll('1', '2', 'ACTIVE', 'INACTIVE', '1', '10');
      expect(result.success).toBe(true);
      expect(result.pagination.page).toBe(1);
    });

    it('should throw BadRequestException if personId is invalid', async () => {
      await expect(controller.getAll('abc')).rejects.toThrow('Invalid personId');
    });

    it('should throw BadRequestException if changedBy is invalid', async () => {
      await expect(controller.getAll(undefined, 'abc')).rejects.toThrow('Invalid changedBy');
    });

    it('should throw BadRequestException if page is invalid', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, 'abc'),
      ).rejects.toThrow('Invalid page');
    });

    it('should throw BadRequestException if page is less than 1', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, '0'),
      ).rejects.toThrow('Invalid page');
    });

    it('should throw BadRequestException if limit is invalid', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, '1', 'abc'),
      ).rejects.toThrow('Invalid limit');
    });

    it('should throw BadRequestException if limit is less than 1', async () => {
      await expect(
        controller.getAll(undefined, undefined, undefined, undefined, '1', '0'),
      ).rejects.toThrow('Invalid limit');
    });

    it('should throw BadRequestException on service error', async () => {
      service.getAllEntries.mockRejectedValue(new Error('Test error'));
      await expect(controller.getAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an entry', async () => {
      service.updateEntry.mockResolvedValue({ id: 10 } as any);
      const result = await controller.update('10', { reason: 'test' } as any);
      expect(result.success).toBe(true);
      expect(service.updateEntry).toHaveBeenCalled();
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(controller.update('abc', {})).rejects.toThrow('Invalid ID');
    });

    it('should throw NotFoundException if entry not found', async () => {
      service.updateEntry.mockResolvedValue(null);
      await expect(controller.update('10', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on service error', async () => {
      service.updateEntry.mockRejectedValue(new Error('Test error'));
      await expect(controller.update('10', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete an entry', async () => {
      service.deleteEntry.mockResolvedValue(true);
      const result = await controller.delete('10');
      expect(result.success).toBe(true);
      expect(service.deleteEntry).toHaveBeenCalledWith(10);
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(controller.delete('abc')).rejects.toThrow('Invalid ID');
    });

    it('should throw NotFoundException if entry not found', async () => {
      service.deleteEntry.mockResolvedValue(false);
      await expect(controller.delete('10')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on service error', async () => {
      service.deleteEntry.mockRejectedValue(new Error('Test error'));
      await expect(controller.delete('10')).rejects.toThrow(BadRequestException);
    });
  });
});
