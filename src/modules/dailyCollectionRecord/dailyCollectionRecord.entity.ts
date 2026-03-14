import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'daily_collection_record' })
@Index('uq_collection_person_resource_day', ['personId', 'resourceTypeId', 'date'], {
  unique: true,
})
@Index('idx_collection_person_date', ['personId', 'date'])
@Index('idx_collection_camp_date', ['campId', 'date'])
export class DailyCollectionRecordEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({ name: 'resource_type_id', type: 'int' })
  resourceTypeId!: number;

  @Column({ name: 'date', type: 'date' })
  date!: Date;

  @Column({
    name: 'expected_amount',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  expectedAmount!: string;

  @Column({
    name: 'actual_amount',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: '0.00',
  })
  actualAmount!: string;

  @Column({ name: 'difference_reason', type: 'text', nullable: true })
  differenceReason!: string | null;

  @Column({ name: 'recorded_by', type: 'int' })
  recordedBy!: number;

  @Column({ name: 'movement_id', type: 'int', nullable: true })
  movementId!: number | null;
}
