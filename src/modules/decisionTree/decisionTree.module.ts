import { Module } from '@nestjs/common';

import { DecisionTreeController } from './decisionTree.controller';
import { DecisionTreeRepository } from './decisionTree.repository';
import { DecisionTreeService } from './decisionTree.service';

@Module({
  controllers: [DecisionTreeController],
  providers: [DecisionTreeRepository, DecisionTreeService],
})
export class DecisionTreeModule {}
