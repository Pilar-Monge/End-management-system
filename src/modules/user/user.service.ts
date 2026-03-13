import { Injectable } from '@nestjs/common';
import { UserRepository } from "./user.repository";
import { User, CreateUserDTO, UserResponse, LoginDTO } from "./user.model";
import { EncryptionService } from "../../services/encryption.service";

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const passwordHash = await EncryptionService.hashPassword(data.password);
    
    const user = await this.userRepo.create({
      personaId: data.personaId,
      solicitudId: data.solicitudId,
      username: data.username,
      passwordHash: passwordHash,
      correo: data.correo,
      nombreCompleto: data.nombreCompleto,
      rol: data.rol || 'VISITANTE',
      campamentoId: data.campamentoId
    });

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async findAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepo.findAll();
    return users.map(({ passwordHash: _, ...user }) => user);
  }

  async findUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepo.findById(id);
    if (!user) return null;
    
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async findUserByUsername(username: string, campamentoId: string): Promise<User | null> {
    return this.userRepo.findByUsername(username, campamentoId);
  }

  async updateUser(id: string, data: Partial<Omit<CreateUserDTO, 'password'>> & { password?: string }): Promise<UserResponse | null> {
    let passwordHash: string | undefined;
    
    if (data.password) {
      passwordHash = await EncryptionService.hashPassword(data.password);
    }

    const updateData: any = { ...data };
    delete updateData.password;
    
    const user = await this.userRepo.update(id, {
      ...updateData,
      passwordHash
    });

    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepo.delete(id);
  }

  async login(credentials: LoginDTO): Promise<UserResponse | null> {
    const user = await this.userRepo.findByUsername(credentials.username, credentials.campamentoId);
    
    if (!user) return null;
    
    const isValid = await EncryptionService.comparePassword(credentials.password, user.passwordHash);
    
    if (!isValid) return null;
    
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async countUsersByCampamento(campamentoId: string): Promise<number> {
    return this.userRepo.countByCampamento(campamentoId);
  }

  async changeUserRole(id: string, newRole: User['rol']): Promise<UserResponse | null> {
    const user = await this.userRepo.update(id, { rol: newRole });
    
    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async toggleUserStatus(id: string, newStatus: User['estado']): Promise<UserResponse | null> {
    const user = await this.userRepo.update(id, { estado: newStatus });
    
    if (!user) return null;

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }
}