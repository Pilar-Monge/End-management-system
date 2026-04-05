import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  ADMISSION_REQUEST_STATUS_VALUES,
  GENDER_VALUES,
  type AdmissionRequestStatus,
  type Gender,
} from './admissionRequest.model';

@Entity({ name: 'admission_request' })
@Index('idx_admission_request_camp', ['campId'])
@Index('idx_admission_request_status', ['status'])
@Index('idx_admission_request_email', ['email'])
export class AdmissionRequestEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'name', type: 'text' })
  @ApiProperty()
  name!: string;

  @Column({ name: 'last_name1', type: 'text' })
  @ApiProperty()
  lastName1!: string;

  @Column({ name: 'last_name2', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  lastName2!: string | null;

  @Column({ name: 'email', type: 'text' })
  @ApiProperty()
  email!: string;

  @Column({ name: 'desired_username', type: 'text' })
  @ApiProperty()
  desiredUsername!: string;

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

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'declared_health_level', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  declaredHealthLevel!: string | null;

  @Column({ name: 'previous_experience', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  previousExperience!: string | null;

  @Column({ name: 'physical_condition', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  physicalCondition!: string | null;

  @Column({ name: 'declared_skills', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  declaredSkills!: string | null;

  @Column({ name: 'health_level_score', type: 'int', nullable: true })
  healthLevelScore!: number | null;

  @Column({ name: 'physical_condition_score', type: 'int', nullable: true })
  physicalConditionScore!: number | null;

  @Column({ name: 'experience_years', type: 'int', nullable: true })
  experienceYears!: number | null;

  @Column({ name: 'skills_score', type: 'int', nullable: true })
  skillsScore!: number | null;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ADMISSION_REQUEST_STATUS_VALUES,
    enumName: 'admission_request_status_enum',
    default: 'PENDING_AI',
  })
  @ApiProperty({ enum: ADMISSION_REQUEST_STATUS_VALUES })
  status!: AdmissionRequestStatus;

  @Column({ name: 'suggested_occupation_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  suggestedOccupationId!: number | null;

  @Column({ name: 'final_occupation_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  finalOccupationId!: number | null;

  @Column({ name: 'occupation_modified', type: 'boolean', default: false })
  @ApiProperty()
  occupationModified!: boolean;

  @Column({ name: 'reviewed_by', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  reviewedBy!: number | null;

  @Column({ name: 'review_date', type: 'timestamptz', nullable: true })
  @ApiProperty({ nullable: true })
  reviewDate!: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  rejectionReason!: string | null;

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
