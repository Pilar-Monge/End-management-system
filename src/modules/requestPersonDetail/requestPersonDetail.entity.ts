import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  PERSON_DETAIL_STATUS_VALUES,
  PERSON_DETAIL_TYPE_VALUES,
  type PersonDetailStatus,
  type PersonDetailType,
} from './requestPersonDetail.model';

@Entity({ name: 'request_person_detail' })
@Index('idx_request_person_detail', ['requestId'])
@Check(
  'chk_request_person_logic',
  `(
    ("detail_type" = 'SPECIFIC' AND "person_id" IS NOT NULL) OR
    ("detail_type" = 'BY_OCCUPATION' AND "occupation_id" IS NOT NULL)
  )`,
)
@Check('chk_request_person_amount', `"amount" > 0`)
@Check(
  'chk_request_person_specific_amount',
  `"detail_type" = 'BY_OCCUPATION' OR "amount" = 1`,
)
export class RequestPersonDetailEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'request_id', type: 'int' })
  @ApiProperty()
  requestId!: number;

  @Column({
    name: 'detail_type',
    type: 'enum',
    enum: PERSON_DETAIL_TYPE_VALUES,
    enumName: 'person_detail_type_enum',
    default: 'BY_OCCUPATION',
  })
  @ApiProperty({ enum: PERSON_DETAIL_TYPE_VALUES })
  detailType!: PersonDetailType;

  @Column({ name: 'person_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  personId!: number | null;

  @Column({ name: 'occupation_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  occupationId!: number | null;

  @Column({ name: 'amount', type: 'int', default: 1 })
  @ApiProperty()
  amount!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PERSON_DETAIL_STATUS_VALUES,
    enumName: 'person_detail_status_enum',
    default: 'PROPOSED',
  })
  @ApiProperty({ enum: PERSON_DETAIL_STATUS_VALUES })
  status!: PersonDetailStatus;
}
