import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  id!: number;

  @Column({ name: 'origin_camp_id', type: 'int' })
  @ApiProperty()
  originCampId!: number;

  @Column({ name: 'destination_camp_id', type: 'int' })
  @ApiProperty()
  destinationCampId!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: INTERCAMP_REQUEST_STATUS_VALUES,
    enumName: 'intercamp_request_status_enum',
    default: 'DRAFT',
  })
  @ApiProperty({ enum: INTERCAMP_REQUEST_STATUS_VALUES })
  status!: IntercampRequestStatus;

  @Column({ name: 'description', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  description!: string | null;

  @Column({ name: 'planned_departure_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  plannedDepartureDate!: Date | null;

  @Column({ name: 'planned_arrival_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  plannedArrivalDate!: Date | null;

  @Column({
    name: 'person_requirements',
    type: 'jsonb',
    nullable: false,
    default: () => "'[]'::jsonb",
  })
  @ApiProperty({ type: 'array', isArray: true, nullable: false })
  personRequirements!: Array<{ occupationId: number; quantity: number }>;

  @Column({
    name: 'created_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdDate!: Date;

  @Column({ name: 'response_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  responseDate!: Date | null;

  @Column({ name: 'created_by', type: 'int' })
  @ApiProperty()
  createdBy!: number;

  @Column({ name: 'responded_by', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  respondedBy!: number | null;
}
