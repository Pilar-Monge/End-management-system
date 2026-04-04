import { Injectable } from '@nestjs/common';
import { UserRepository } from './systemUser.repository';
import { User, CreateUserDTO, UserResponse } from './systemUser.model';
import { EncryptionService } from '../../services/encryption.service';
import type { UpdateSystemUserDto } from './dto';
import { UserRoleHistoryRepository } from '../userRoleHistory/userRoleHistory.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly userRoleHistoryRepository: UserRoleHistoryRepository,
  ) {}

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const passwordHash = await EncryptionService.hashPassword(data.password);

    const user = await this.userRepo.create({
      personId: data.personId,
      requestId: data.requestId,
      username: data.username,
      passwordHash: passwordHash,
      email: data.email,
      role: data.role || 'VISITOR',
      campId: data.campId,
    });

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async findAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepo.findAll();
    return users.map(({ passwordHash: _, ...user }) => user);
  }

  async findUserById(id: number): Promise<UserResponse | null> {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async findUserByUsername(username: string, campId: number): Promise<User | null> {
    return this.userRepo.findByUsername(username, campId);
  }

  async updateUser(
    id: number,
    data: Partial<Pick<UpdateSystemUserDto, 'role' | 'status'>>,
  ): Promise<UserResponse | null> {
    const existing = await this.userRepo.findById(id);
    if (!existing) return null;

    const updateData: Partial<Pick<UpdateSystemUserDto, 'role' | 'status'>> = {};

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const user = await this.userRepo.update(id, {
      ...updateData,
    });

    if (data.role !== undefined && data.role !== existing.role) {
      await this.userRoleHistoryRepository.create({
        userId: id,
        previousRole: existing.role,
        newRole: data.role,
        changedBy: 0,
        reason: null,
      });
    }

    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepo.delete(id);
  }

  async countUsersByCamp(campId: number): Promise<number> {
    return this.userRepo.countByCamp(campId);
  }

  async changeUserRole(id: number, newRole: User['role']): Promise<UserResponse | null> {
    const user = await this.userRepo.update(id, { role: newRole });

    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async toggleUserStatus(id: number, newStatus: User['status']): Promise<UserResponse | null> {
    const user = await this.userRepo.update(id, { status: newStatus });

    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }
}
