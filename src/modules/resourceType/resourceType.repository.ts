import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceTypeEntity } from './resourceType.entity';
import type {
  CreateResourceTypeDTO,
  ResourceCategory,
  ResourceType,
  UpdateResourceTypeDTO,
} from './resourceType.model';

@Injectable()
export class ResourceTypeRepository {
  constructor(
    @InjectRepository(ResourceTypeEntity)
    private readonly repo: Repository<ResourceTypeEntity>,
  ) {}

  async create(data: CreateResourceTypeDTO): Promise<ResourceType> {
    const entity = this.repo.create({
      name: data.name,
      unitOfMeasure: data.unitOfMeasure,
      category: data.category,
      description: data.description ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<ResourceType | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<ResourceType | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async findAllAndCount(filters?: {
    category?: ResourceCategory;
    offset?: number;
    limit?: number;
  }): Promise<{ data: ResourceType[]; total: number }> {
    const qb = this.repo.createQueryBuilder('rt');

    if (filters?.category !== undefined) {
      qb.andWhere('rt.category = :category', { category: filters.category });
    }

    qb.orderBy('rt.id', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateResourceTypeDTO): Promise<ResourceType | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<ResourceTypeEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
