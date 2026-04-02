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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from './systemUser.service';
import type { CreateUserDTO, LoginDTO } from './systemUser.model';

import {
  CreateSystemUserDto,
  LoginSystemUserDto,
  SystemUserResponseDto,
  UpdateSystemUserDto,
} from './dto';

@Controller()
@ApiTags('System User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('users')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateSystemUserDto })
  @ApiCreatedResponse({ description: 'User created', type: SystemUserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async create(@Body() body: CreateUserDTO) {
    try {
      return await this.service.createUser(body);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating user');
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ description: 'Users list', type: SystemUserResponseDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async findAll() {
    try {
      return await this.service.findAllUsers();
    } catch (error) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Error getting users');
    }
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponse({ description: 'User found', type: SystemUserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const user = await this.service.findUserById(parsedId);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiBody({ type: UpdateSystemUserDto })
  @ApiOkResponse({ description: 'User updated', type: SystemUserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async update(@Param('id') id: string, @Body() body: UpdateSystemUserDto) {
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
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async delete(@Param('id') id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const deleted = await this.service.deleteUser(parsedId);
    if (!deleted) throw new NotFoundException('User not found');
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginSystemUserDto })
  @ApiOkResponse({ description: 'Login succeeded', type: SystemUserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
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