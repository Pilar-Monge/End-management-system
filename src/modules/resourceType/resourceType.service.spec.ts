import { ResourceTypeService } from './resourceType.service';

describe('ResourceTypeService', () => {
  const repository = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAllAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: ResourceTypeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ResourceTypeService(repository as never);
  });

  it('createResourceType throws when name already exists', async () => {
    repository.findByName.mockResolvedValue({ id: 1, name: 'Water' });

    await expect(service.createResourceType({ name: 'Water' } as never)).rejects.toThrow(
      'A resource type with this name already exists',
    );
  });

  it('createResourceType creates when unique', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 2, name: 'Medicine' });

    await expect(service.createResourceType({ name: 'Medicine' } as never)).resolves.toEqual({
      id: 2,
      name: 'Medicine',
    });
  });

  it('getAllResourceTypes uses default pagination', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

    await service.getAllResourceTypes();

    expect(repository.findAllAndCount).toHaveBeenCalledWith({ offset: 0, limit: 10 });
  });

  it('getAllResourceTypes passes category filter', async () => {
    repository.findAllAndCount.mockResolvedValue({ data: [], total: 0 });

    await service.getAllResourceTypes({ category: 'FOOD' as never, page: 2, limit: 5 });

    expect(repository.findAllAndCount).toHaveBeenCalledWith({
      category: 'FOOD',
      offset: 5,
      limit: 5,
    });
  });

  it('updateResourceType returns null when id is missing', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.updateResourceType(9, { name: 'X' })).resolves.toBeNull();
  });

  it('updateResourceType throws for duplicate name', async () => {
    repository.findById.mockResolvedValue({ id: 1, name: 'Old' });
    repository.findByName.mockResolvedValue({ id: 2, name: 'New' });

    await expect(service.updateResourceType(1, { name: 'New' })).rejects.toThrow(
      'Another resource type with this name already exists',
    );
  });

  it('updateResourceType updates when valid', async () => {
    repository.findById.mockResolvedValue({ id: 1, name: 'Old' });
    repository.findByName.mockResolvedValue(null);
    repository.update.mockResolvedValue({ id: 1, name: 'New' });

    await expect(service.updateResourceType(1, { name: 'New' })).resolves.toEqual({
      id: 1,
      name: 'New',
    });
  });

  it('deleteResourceType delegates to repository', async () => {
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteResourceType(1)).resolves.toBe(true);
  });
});
