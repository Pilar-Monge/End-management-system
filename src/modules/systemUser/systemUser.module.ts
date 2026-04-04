import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './systemUser.controller';
import { UserEntity } from './systemUser.entity';
import { UserRepository } from './systemUser.repository';
import { UserRoleHistoryEntity } from '../userRoleHistory/userRoleHistory.entity';
import { UserRoleHistoryRepository } from '../userRoleHistory/userRoleHistory.repository';
import { UserService } from './systemUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleHistoryEntity])],
  controllers: [UserController],
  providers: [UserRepository, UserRoleHistoryRepository, UserService],
})
export class UserModule {}
