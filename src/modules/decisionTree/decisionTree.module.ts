import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DecisionTreeController } from './decisionTree.controller';
import { DecisionTreeEntity } from './decisionTree.entity';
import { DecisionTreeRepository } from './decisionTree.repository';
import { DecisionTreeService } from './decisionTree.service';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionTreeEntity])],
  controllers: [DecisionTreeController],
  providers: [DecisionTreeRepository, DecisionTreeService],
})
export class DecisionTreeModule {}
