import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OccupationController } from './occupation.controller';
import { OccupationEntity } from './occupation.entity';
import { OccupationRepository } from './occupation.repository';
import { OccupationService } from './occupation.service';

@Module({
  imports: [TypeOrmModule.forFeature([OccupationEntity])],
  controllers: [OccupationController],
  providers: [OccupationRepository, OccupationService],
})
export class OccupationModule {}
