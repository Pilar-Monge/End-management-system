import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { RESOURCE_CATEGORY_VALUES, type ResourceCategory } from './resourceType.model';

@Entity({ name: 'resource_type' })
@Unique('uq_tipo_recurso_nombre', ['name'])
export class ResourceTypeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'unit_of_measure', type: 'text' })
  unitOfMeasure!: string;

  @Column({
    name: 'category',
    type: 'enum',
    enum: RESOURCE_CATEGORY_VALUES,
    enumName: 'resource_category_enum',
  })
  category!: ResourceCategory;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;
}
