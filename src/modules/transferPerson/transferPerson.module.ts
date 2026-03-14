import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransferPersonController } from './transferPerson.controller';
import { TransferPersonEntity } from './transferPerson.entity';
import { TransferPersonRepository } from './transferPerson.repository';
import { TransferPersonService } from './transferPerson.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferPersonEntity])],
  controllers: [TransferPersonController],
  providers: [TransferPersonRepository, TransferPersonService],
})
export class TransferPersonModule {}
