import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'expedition_resource_consumed' })
@Check('chk_exp_cons_cant', `"amount" > 0`)
export class ExpeditionResourceConsumedEntity {
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
