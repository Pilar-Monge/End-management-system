import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import {
  INTERCAMP_REQUEST_STATUS_VALUES,
  type IntercampRequestStatus,
} from './intercampRequest.model';

@Entity({ name: 'intercamp_request' })
@Index('idx_solicitud_origen', ['originCampId'])
@Index('idx_solicitud_destino', ['destinationCampId'])
@Index('idx_solicitud_estado', ['status'])
@Check('chk_solicitud_camp_distintos', `"origin_camp_id" <> "destination_camp_id"`)
export class IntercampRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'origin_camp_id', type: 'int' })
  originCampId!: number;

  @Column({ name: 'destination_camp_id', type: 'int' })
  destinationCampId!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: INTERCAMP_REQUEST_STATUS_VALUES,
    enumName: 'intercamp_request_status_enum',
    default: 'PENDING',
  })
  status!: IntercampRequestStatus;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({
    name: 'created_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdDate!: Date;

  @Column({ name: 'response_date', type: 'timestamptz', nullable: true })
  responseDate!: Date | null;

  @Column({ name: 'created_by', type: 'int' })
  createdBy!: number;

  @Column({ name: 'responded_by', type: 'int', nullable: true })
  respondedBy!: number | null;
}
