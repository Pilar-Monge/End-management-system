import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, type FindManyOptions } from 'typeorm';

import { AchievementEntity } from './achievement.entity';
import type { Achievement, CreateAchievementDTO, UpdateAchievementDTO } from './achievement.model';

@Injectable()
export class AchievementRepository {
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly repo: Repository<AchievementEntity>,
  ) {}

  async create(data: CreateAchievementDTO): Promise<Achievement> {
    const entity = this.repo.create({
      name: data.name,
      description: data.description ?? null,
      unlockCondition: data.unlockCondition,
      iconUrl: data.iconUrl ?? null,
    });

    return await this.repo.save(entity);
  }

  async findById(id: number): Promise<Achievement | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Achievement | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async findAllAndCount(filters?: {
    name?: string;
    offset?: number;
    limit?: number;
  }): Promise<{ data: Achievement[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filters?.name) {
      where.name = ILike(`%${filters.name}%`);
    }

    const options: FindManyOptions<AchievementEntity> = {
      where,
      order: { id: 'DESC' },
    };

    if (filters?.limit !== undefined) options.take = filters.limit;
    if (filters?.offset !== undefined) options.skip = filters.offset;

    const [data, total] = await this.repo.findAndCount(options);

    return { data, total };
  }

  async update(id: number, data: UpdateAchievementDTO): Promise<Achievement | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<AchievementEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
