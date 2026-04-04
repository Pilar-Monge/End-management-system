import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'daily_collection_record' })
@Index('uq_collection_person_resource_day', ['personId', 'resourceTypeId', 'date'], {
  unique: true,
})
@Index('idx_collection_person_date', ['personId', 'date'])
@Index('idx_collection_camp_date', ['campId', 'date'])
export class DailyCollectionRecordEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({ name: 'person_id', type: 'int' })
  @ApiProperty()
  personId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  @ApiProperty()
  resourceTypeId!: number;

  @Column({ name: 'date', type: 'date' })
  @ApiProperty()
  date!: Date;

  @Column({
    name: 'expected_amount',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  @ApiProperty()
  expectedAmount!: string;

  @Column({
    name: 'actual_amount',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  @ApiProperty()
  actualAmount!: string;

  @Column({ name: 'difference_reason', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  differenceReason!: string | null;

  @Column({ name: 'recorded_by', type: 'int' })
  @ApiProperty()
  recordedBy!: number;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  movementId!: number | null;
}
