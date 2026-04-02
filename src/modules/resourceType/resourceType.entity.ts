import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  RESOURCE_CATEGORY_VALUES,
  type ResourceCategory,
} from './resourceType.model';

@Entity({ name: 'resource_type' })
@Unique('uq_tipo_recurso_nombre', ['name'])
export class ResourceTypeEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'unit_of_measure', type: 'text' })
  @ApiProperty()
  unitOfMeasure!: string;

  @Column({
    name: 'category',
    type: 'enum',
    enum: RESOURCE_CATEGORY_VALUES,
    enumName: 'resource_category_enum',
  })
  @ApiProperty({ enum: RESOURCE_CATEGORY_VALUES })
  category!: ResourceCategory;

  @Column({ name: 'description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  description!: string | null;
}
