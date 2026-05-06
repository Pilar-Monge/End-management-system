import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRoleHistoryService } from '../../modules/userRoleHistory/userRoleHistory.service';
import { UserEntity } from '../../modules/systemUser/systemUser.entity';

describe('UserRoleHistoryService (API service unit tests)', () => {
  let repository: any;
  let dataSource: any;
  let userRepo: any;
  let service: UserRoleHistoryService;

  beforeEach(() => {
    repository = {
      createEntryTransactional: jest.fn(),
      findById: jest.fn(),
      findAllAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userRepo = { findOne: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === UserEntity) return userRepo;
        return { findOne: jest.fn() };
      }),
    };

    service = new UserRoleHistoryService(repository, dataSource as any);
  });

  it('createEntry returns created entry', async () => {
    repository.createEntryTransactional.mockResolvedValue({ createdEntry: { id: 1 } });
    await expect(service.createEntry({} as any)).resolves.toEqual({ id: 1 });
  });

  it('createEntry maps USER_NOT_FOUND', async () => {
    repository.createEntryTransactional.mockRejectedValue(new Error('USER_NOT_FOUND'));
    await expect(service.createEntry({} as any)).rejects.toThrow(NotFoundException);
  });

  it('createEntry maps CHANGED_BY_NOT_FOUND', async () => {
    repository.createEntryTransactional.mockRejectedValue(new Error('CHANGED_BY_NOT_FOUND'));
    await expect(service.createEntry({} as any)).rejects.toThrow(NotFoundException);
  });

  it('createEntry maps PREVIOUS_ROLE_MISMATCH', async () => {
    repository.createEntryTransactional.mockRejectedValue(new Error('PREVIOUS_ROLE_MISMATCH'));
    await expect(service.createEntry({} as any)).rejects.toThrow(BadRequestException);
  });

  it('getEntryCampId returns null when entry missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.getEntryCampId(1)).resolves.toBeNull();
  });

  it('getEntryCampId returns null when user missing', async () => {
    repository.findById.mockResolvedValue({ id: 1, userId: 5 });
    userRepo.findOne.mockResolvedValue(null);
    await expect(service.getEntryCampId(1)).resolves.toBeNull();
  });

  it('getEntryCampId returns campId when user found', async () => {
    repository.findById.mockResolvedValue({ id: 1, userId: 5 });
    userRepo.findOne.mockResolvedValue({ campId: 9 });
    await expect(service.getEntryCampId(1)).resolves.toBe(9);
  });

  it('getUserCampId returns campId', async () => {
    userRepo.findOne.mockResolvedValue({ campId: 7 });
    await expect(service.getUserCampId(5)).resolves.toBe(7);
  });

  it('getAllEntries forwards filters with offset', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });
    await service.getAllEntries({ userId: 2, page: 2, limit: 5 });
    expect(repository.findAllAndCount).toHaveBeenCalledWith({ userId: 2, offset: 5, limit: 5 });
  });

  it('updateEntry returns repository result', async () => {
    repository.update.mockResolvedValue({ id: 1 });
    await expect(service.updateEntry(1, {} as any)).resolves.toEqual({ id: 1 });
  });

  it('deleteEntry returns repository result', async () => {
    repository.delete.mockResolvedValue(true);
    await expect(service.deleteEntry(1)).resolves.toBe(true);
  });
});
