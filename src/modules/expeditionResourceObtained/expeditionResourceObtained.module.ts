import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { UserEntity } from '../systemUser/systemUser.entity';
import { ExpeditionResourceObtainedController } from './expeditionResourceObtained.controller';
import { ExpeditionResourceObtainedEntity } from './expeditionResourceObtained.entity';
import { ExpeditionResourceObtainedRepository } from './expeditionResourceObtained.repository';
import { ExpeditionResourceObtainedService } from './expeditionResourceObtained.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpeditionResourceObtainedEntity,
      ExpeditionEntity,
      InventoryMovementEntity,
      UserEntity,
    ]),
  ],
  controllers: [ExpeditionResourceObtainedController],
  providers: [ExpeditionResourceObtainedRepository, ExpeditionResourceObtainedService],
})
export class ExpeditionResourceObtainedModule {}
