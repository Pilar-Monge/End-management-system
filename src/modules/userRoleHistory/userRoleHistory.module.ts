import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRoleHistoryController } from './userRoleHistory.controller';
import { UserRoleHistoryEntity } from './userRoleHistory.entity';
import { UserRoleHistoryRepository } from './userRoleHistory.repository';
import { UserRoleHistoryService } from './userRoleHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleHistoryEntity])],
  controllers: [UserRoleHistoryController],
  providers: [UserRoleHistoryRepository, UserRoleHistoryService],
})
export class UserRoleHistoryModule {}
