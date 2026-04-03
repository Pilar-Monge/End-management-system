import { Check, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  id!: number;

  @Column({ name: 'request_id', type: 'int' })
  @ApiProperty()
  requestId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  @ApiProperty()
  resourceTypeId!: number;

  @Column({
    name: 'requested_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @ApiProperty()
  requestedAmount!: string;

  @Column({
    name: 'approved_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  @ApiProperty({ nullable: true })
  approvedAmount!: string | null;
}
