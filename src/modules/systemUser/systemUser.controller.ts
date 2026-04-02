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
import { Roles } from '../../common/decorators';
import { UserService } from './systemUser.service';
import type { CreateUserDTO } from './systemUser.model';
import {
  CreateSystemUserDto,
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async create(@Body() body: CreateUserDTO) {
    try {
      return await this.service.createUser(body);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error creating user');
    }
  }

  @Get('users')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ description: 'Users list', type: SystemUserResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async findAll() {
    try {
      return await this.service.findAllUsers();
    } catch (error) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Error getting users');
    }
  }

  @Get('users/:id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponse({ description: 'User found', type: SystemUserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async delete(@Param('id') id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID not provided');

    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');

    const deleted = await this.service.deleteUser(parsedId);
    if (!deleted) throw new NotFoundException('User not found');
  }
}