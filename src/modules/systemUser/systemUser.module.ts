import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './systemUser.controller';
import { UserEntity } from './systemUser.entity';
import { UserRepository } from './systemUser.repository';
import { UserService } from './systemUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
