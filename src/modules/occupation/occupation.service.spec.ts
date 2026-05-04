import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { OccupationService } from './occupation.service';

jest.mock('../../common/validation/assert-exists', () => ({
  assertEntityExists: jest.fn(),
}));

describe('OccupationService', () => {
  const mockedAssertEntityExists = assertEntityExists as jest.MockedFunction<
    typeof assertEntityExists
  >;

  const repository = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: OccupationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OccupationService(repository as never, {} as DataSource);
  });

  it('createOccupation validates resourceType and throws on duplicate name', async () => {
    repository.findByName.mockResolvedValue({ id: 1, name: 'Scout' });

    await expect(
      service.createOccupation({ name: 'Scout', resourceTypeId: 5 } as never),
    ).rejects.toThrow('An occupation with this name already exists');

    expect(mockedAssertEntityExists).toHaveBeenCalledWith(
      expect.anything(),
      ResourceTypeEntity,
      5,
      'Resource type',
    );
  });

  it('createOccupation creates when name is available', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 2, name: 'Medic' });

    await expect(service.createOccupation({ name: 'Medic' } as never)).resolves.toEqual({
      id: 2,
      name: 'Medic',
    });
  });

  it('getAllOccupations maps filters and pagination', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

    await service.getAllOccupations({
      collectsResources: true,
      participatesInExpeditions: false,
      resourceTypeId: 8,
      page: 2,
      limit: 7,
    });

    expect(repository.findAllAndCount).toHaveBeenCalledWith({
      collectsResources: true,
      participatesInExpeditions: false,
      resourceTypeId: 8,
      offset: 7,
      limit: 7,
    });
  });

  it('updateOccupation returns null when target not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.updateOccupation(99, { name: 'x' })).resolves.toBeNull();
  });

  it('updateOccupation validates resourceType and throws duplicate name', async () => {
    repository.findById.mockResolvedValue({ id: 1, name: 'Scout' });
    repository.findByName.mockResolvedValue({ id: 2, name: 'Guard' });

    await expect(
      service.updateOccupation(1, { name: 'Guard', resourceTypeId: 10 } as never),
    ).rejects.toThrow('Another occupation with this name already exists');

    expect(mockedAssertEntityExists).toHaveBeenCalledWith(
      expect.anything(),
      ResourceTypeEntity,
      10,
      'Resource type',
    );
  });

  it('updateOccupation updates successfully', async () => {
    repository.findById.mockResolvedValue({ id: 1, name: 'Scout' });
    repository.findByName.mockResolvedValue(null);
    repository.update.mockResolvedValue({ id: 1, name: 'Explorer' });

    await expect(service.updateOccupation(1, { name: 'Explorer' })).resolves.toEqual({
      id: 1,
      name: 'Explorer',
    });
  });

  it('deleteOccupation delegates to repository', async () => {
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteOccupation(7)).resolves.toBe(true);
  });
});
