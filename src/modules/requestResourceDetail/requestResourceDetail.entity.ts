import { Check, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'request_resource_detail' })
@Unique('uq_solicitud_recurso', ['requestId', 'resourceTypeId'])
@Index('idx_sol_recurso_detalle', ['requestId'])
@Check('chk_sol_rec_solicitada', `"requested_amount" > 0`)
@Check(
  'chk_sol_rec_aprobada',
  `"approved_amount" IS NULL OR "approved_amount" >= 0`,
)
export class RequestResourceDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'request_id', type: 'int' })
  requestId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({
    name: 'requested_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  requestedAmount!: string;

  @Column({
    name: 'approved_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  approvedAmount!: string | null;
}
