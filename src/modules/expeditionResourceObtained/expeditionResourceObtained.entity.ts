import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'expedition_resource_obtained' })
@Unique('uq_exp_obten_recurso', ['expeditionId', 'resourceTypeId'])
@Check('chk_exp_obten_cant', `"amount" > 0`)
export class ExpeditionResourceObtainedEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'expedition_id', type: 'int' })
  @ApiProperty()
  expeditionId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  @ApiProperty()
  resourceTypeId!: number;

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  amount!: string;

  @Column({ name: 'recorded_by', type: 'int' })
  @ApiProperty()
  recordedBy!: number;

  @Column({
    name: 'record_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  recordDate!: Date;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  movementId!: number | null;
}
