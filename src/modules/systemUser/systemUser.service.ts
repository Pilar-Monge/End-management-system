import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { assertEntityExists } from '../../common/validation/assert-exists';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { CampEntity } from '../camp/camp.entity';
import { PersonEntity } from '../person/person.entity';
import { UserRepository } from './systemUser.repository';
import { User, CreateUserDTO, UserResponse, LoginDTO } from './systemUser.model';
import { EncryptionService } from '../../services/encryption.service';
import { UserRoleHistoryRepository } from '../userRoleHistory/userRoleHistory.repository';
import type { UpdateSystemUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly userRoleHistoryRepository: UserRoleHistoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    await assertEntityExists(this.dataSource, PersonEntity, data.personId, 'Person');
    await assertEntityExists(
      this.dataSource,
      AdmissionRequestEntity,
      data.requestId,
      'Admission request',
    );
    await assertEntityExists(this.dataSource, CampEntity, data.campId, 'Camp');
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

  async login(data: LoginDTO): Promise<UserResponse | null> {
    const user = await this.userRepo.findByUsername(data.username, data.campId);
    if (!user) return null;
    const valid = await EncryptionService.comparePassword(data.password, user.passwordHash);
    if (!valid) return null;
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async updateUser(
    id: number,
    data: Partial<Pick<UpdateSystemUserDto, 'role' | 'status'>>,
  ): Promise<UserResponse | null> {
    const existing = await this.userRepo.findById(id);
    if (!existing) return null;
    const user = await this.userRepo.update(id, data);
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
