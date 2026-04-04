import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  GENDER_VALUES,
  PERSON_STATUS_VALUES,
  type Gender,
  type PersonStatus,
} from './person.model';

@Entity({ name: 'person' })
@Unique('uq_person_identification', ['identificationNumber'])
@Unique('uq_person_request', ['admissionRequestId'])
@Index('idx_person_camp_id', ['campId'])
@Index('idx_person_current_status', ['currentStatus'])
@Index('idx_person_occupation_id', ['occupationId'])
@Index('idx_person_camp_status', ['campId', 'currentStatus'])
export class PersonEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'admission_request_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  admissionRequestId!: number | null;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'last_name1', type: 'text' })
  @ApiProperty()
  lastName1!: string;

  @Column({ name: 'last_name2', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  lastName2!: string | null;

  @Column({ name: 'identification_number', type: 'text' })
  @ApiProperty()
  identificationNumber!: string;

  @Column({ name: 'birth_date', type: 'date' })
  @ApiProperty()
  birthDate!: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: GENDER_VALUES,
    enumName: 'gender_enum',
  })
  @ApiProperty({ enum: GENDER_VALUES })
  gender!: Gender;

  @Column({ name: 'initial_health_level', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  initialHealthLevel!: string | null;

  @Column({ name: 'previous_experience', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  previousExperience!: string | null;

  @Column({ name: 'physical_condition_at_entry', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  physicalConditionAtEntry!: string | null;

  @Column({
    name: 'current_status',
    type: 'enum',
    enum: PERSON_STATUS_VALUES,
    enumName: 'person_status_enum',
    default: 'ACTIVE',
  })
  @ApiProperty({ enum: PERSON_STATUS_VALUES })
  currentStatus!: PersonStatus;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  imageUrl!: string | null;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({ name: 'occupation_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  occupationId!: number | null;

  @Column({
    name: 'entry_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  entryDate!: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  updatedAt!: Date;
}
