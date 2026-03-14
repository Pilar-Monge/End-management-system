import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController } from './session.controller';
import { SessionEntity } from './session.entity';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [SessionController],
  providers: [SessionRepository, SessionService],
})
export class SessionModule {}
