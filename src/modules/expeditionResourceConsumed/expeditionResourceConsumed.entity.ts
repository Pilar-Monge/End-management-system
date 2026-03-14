import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'expedition_resource_consumed' })
@Unique('uq_exp_cons_recurso', ['expeditionId', 'resourceTypeId'])
@Check('chk_exp_cons_cant', `"amount" > 0`)
export class ExpeditionResourceConsumedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'expedition_id', type: 'int' })
  expeditionId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount!: string;

  @Column({ name: 'recorded_by', type: 'int' })
  recordedBy!: number;

  @Column({
    name: 'record_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  recordDate!: Date;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  movementId!: number | null;
}
