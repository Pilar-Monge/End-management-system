import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponseList,
  ApiOkResponseMessage,
} from '../../common/swagger/api-response.decorator';
import { Roles } from '../../common/decorators';
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
@Roles('SYSTEM_ADMIN')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('users')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateSystemUserDto })
  @ApiCreatedResponseData(SystemUserResponseDto, { description: 'User created' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async create(@Body() body: CreateUserDTO) {
    try {
      const user = await this.service.createUser(body);
      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating user');
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponseList(SystemUserResponseDto, { description: 'Users list' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async findAll() {
    try {
      const users = await this.service.findAllUsers();
      return { success: true, data: users };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Error getting users',
      );
    }
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponseData(SystemUserResponseDto, { description: 'User found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const user = await this.service.findUserById(parsedId);
    if (!user) throw new NotFoundException('User not found');

    return { success: true, data: user };
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiBody({ type: UpdateSystemUserDto })
  @ApiOkResponseData(SystemUserResponseDto, { description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Invalid id or payload' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async update(@Param('id') id: string, @Body() body: UpdateSystemUserDto) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    try {
      const user = await this.service.updateUser(parsedId, body);
      if (!user) throw new NotFoundException('User not found');
      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error updating user');
    }
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponseMessage({ description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const deleted = await this.service.deleteUser(parsedId);
    if (!deleted) throw new NotFoundException('User not found');

    return { success: true, message: 'User deleted successfully' };
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginSystemUserDto })
  @ApiOkResponseData(SystemUserResponseDto, { description: 'Login succeeded' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async login(@Body() body: LoginDTO) {
    try {
      const user = await this.service.login(body);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      return {
        success: true,
        data: user,
        message: 'Login succeeded',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Error logging in',
      );
    }
  }
}