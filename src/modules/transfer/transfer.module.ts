import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransferController } from './transfer.controller';
import { TransferEntity } from './transfer.entity';
import { TransferRepository } from './transfer.repository';
import { TransferService } from './transfer.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransferEntity])],
  controllers: [TransferController],
  providers: [TransferRepository, TransferService],
})
export class TransferModule {}
