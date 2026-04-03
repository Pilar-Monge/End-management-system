import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './systemUser.entity';
import type { CreateUserDBDTO, UpdateUserDTO, User } from './systemUser.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDBDTO): Promise<User> {
    const entity = this.repo.create({
      ...userData,
      role: userData.role ?? 'VISITOR',
      status: userData.status ?? 'ACTIVE',
    });

    return await this.repo.save(entity);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByUsername(username: string, campId: number): Promise<User | null> {
    return await this.repo.findOne({ where: { username, campId } });
  }

  async update(id: number, userData: UpdateUserDTO): Promise<User | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(userData).filter(([, value]) => value !== undefined),
    ) as Partial<UserEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async countByCamp(campId: number): Promise<number> {
    return await this.repo.count({ where: { campId } });
  }
}
