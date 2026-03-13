import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDTO, LoginDTO } from './user.model';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('users')
  async create(@Body() body: CreateUserDTO) {
    try {
      return await this.service.createUser(body);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating user');
    }
  }

  @Get('users')
  async findAll() {
    try {
      return await this.service.findAllUsers();
    } catch (error) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Error getting users');
    }
  }

  @Get('users/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const user = await this.service.findUserById(parsedId);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Put('users/:id')
  async update(@Param('id') id: string, @Body() body: any) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    try {
      const user = await this.service.updateUser(parsedId, body);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error updating user');
    }
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const deleted = await this.service.deleteUser(parsedId);
    if (!deleted) throw new NotFoundException('User not found');
  }

  @Post('auth/login')
  async login(@Body() body: LoginDTO) {
    try {
      const user = await this.service.login(body);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Error logging in');
    }
  }
}