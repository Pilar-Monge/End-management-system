import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceTypeController } from './resourceType.controller';
import { ResourceTypeEntity } from './resourceType.entity';
import { ResourceTypeRepository } from './resourceType.repository';
import { ResourceTypeService } from './resourceType.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceTypeEntity])],
  controllers: [ResourceTypeController],
  providers: [ResourceTypeRepository, ResourceTypeService],
})
export class ResourceTypeModule {}
