import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
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
import { CreateSystemUserDto, SystemUserResponseDto, UpdateSystemUserDto } from './dto';

@Controller()
@ApiTags('System User')
export class UserController {
  constructor(private readonly service: UserService) {}

  private getCurrentUser(req: Request): { userId: number; campId: number; rol: string } {
    const currentUser = req.user as { userId?: number; campId?: number; rol?: string } | undefined;

    if (
      typeof currentUser?.userId !== 'number' ||
      currentUser.userId <= 0 ||
      typeof currentUser.campId !== 'number' ||
      currentUser.campId <= 0 ||
      typeof currentUser.rol !== 'string' ||
      !currentUser.rol
    ) {
      throw new BadRequestException('Authenticated user context is invalid');
    }

    return {
      userId: currentUser.userId,
      campId: currentUser.campId,
      rol: currentUser.rol,
    };
  }

  @Post('users')
  @Roles('NO_ACCESS')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateSystemUserDto })
  @ApiCreatedResponseData(SystemUserResponseDto)
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async create() {
    throw new ForbiddenException(
      'Manual user creation is disabled. Users must be created through the automated Admission Request flow.',
    );
  }

  @Get('users')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponseList(SystemUserResponseDto)
  @ApiInternalServerErrorResponse()
  async findAll(@Req() req: Request) {
    try {
      const currentUser = this.getCurrentUser(req);
      const users = await this.service.findAllUsers();
      return {
        success: true,
        data: users.filter((user) => user.campId === currentUser.campId),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Error getting users',
      );
    }
  }

  @Get('users/:id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponseData(SystemUserResponseDto)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async findById(@Param('id') id: string, @Req() req: Request) {
    if (!id) throw new BadRequestException('ID not provided');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');
    const currentUser = this.getCurrentUser(req);
    const user = await this.service.findUserById(parsedId);
    if (!user) throw new NotFoundException('User not found');
    if (user.campId !== currentUser.campId) {
      throw new NotFoundException('User not found');
    }
    return { success: true, data: user };
  }

  @Put('users/:id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateSystemUserDto })
  @ApiOkResponseData(SystemUserResponseDto)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async update(@Param('id') id: string, @Body() body: UpdateSystemUserDto, @Req() req: Request) {
    if (!id) throw new BadRequestException('ID not provided');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');
    const currentUser = this.getCurrentUser(req);
    const existingUser = await this.service.findUserById(parsedId);
    if (!existingUser) throw new NotFoundException('User not found');
    if (existingUser.campId !== currentUser.campId) {
      throw new NotFoundException('User not found');
    }
    try {
      const user = await this.service.updateUser(parsedId, body);
      if (!user) throw new NotFoundException('User not found');
      return { success: true, data: user, message: 'User updated successfully' };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Error updating user');
    }
  }

  @Delete('users/:id')
  @Roles('NO_ACCESS')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponseMessage()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID not provided');
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) throw new BadRequestException('invalid ID');
    const deleted = await this.service.deleteUser(parsedId);
    if (!deleted) throw new NotFoundException('User not found');
    return { success: true, message: 'User deleted successfully' };
  }
}
