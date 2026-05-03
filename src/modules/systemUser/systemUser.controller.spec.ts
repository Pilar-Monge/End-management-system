import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserController } from './systemUser.controller';
import type { UserService } from './systemUser.service';
import type { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockRequest = {
    user: {
      userId: 1,
      campId: 1,
      rol: 'SYSTEM_ADMIN',
    },
  } as unknown as Request;

  beforeEach(() => {
    service = {
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as any;
    controller = new UserController(service);
  });

  describe('create', () => {
    it('should throw ForbiddenException', async () => {
      await expect(controller.create()).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return users from the same camp', async () => {
      const users = [
        { id: 1, campId: 1 },
        { id: 2, campId: 2 },
      ];
      service.findAllUsers.mockResolvedValue(users as any);

      const result = await controller.findAll(mockRequest);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(1);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.findAllUsers.mockRejectedValue(new Error('error'));
      await expect(controller.findAll(mockRequest)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findById', () => {
    it('should return user if in same camp', async () => {
      service.findUserById.mockResolvedValue({ id: 10, campId: 1 } as any);
      const result = await controller.findById('10', mockRequest);
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(10);
    });

    it('should throw NotFoundException if user in different camp', async () => {
      service.findUserById.mockResolvedValue({ id: 10, campId: 2 } as any);
      await expect(controller.findById('10', mockRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user if in same camp', async () => {
      service.findUserById.mockResolvedValue({ id: 10, campId: 1 } as any);
      service.updateUser.mockResolvedValue({ id: 10, campId: 1 } as any);

      const result = await controller.update('10', {}, mockRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      service.deleteUser.mockResolvedValue(true);
      const result = await controller.delete('10');
      expect(result.success).toBe(true);
    });
  });
});
