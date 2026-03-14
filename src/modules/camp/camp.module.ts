import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampController } from './camp.controller';
import { CampEntity } from './camp.entity';
import { CampRepository } from './camp.repository';
import { CampService } from './camp.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampEntity])],
  controllers: [CampController],
  providers: [CampRepository, CampService],
})
export class CampModule {}
