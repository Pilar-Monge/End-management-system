import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  id!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'last_name1', type: 'text' })
  lastName1!: string;

  @Column({ name: 'last_name2', type: 'text', nullable: true })
  lastName2!: string | null;

  @Column({ name: 'email', type: 'text' })
  email!: string;

  @Column({ name: 'desired_username', type: 'text' })
  desiredUsername!: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate!: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: GENDER_VALUES,
    enumName: 'gender_enum',
  })
  gender!: Gender;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'declared_health_level', type: 'text', nullable: true })
  declaredHealthLevel!: string | null;

  @Column({ name: 'previous_experience', type: 'text', nullable: true })
  previousExperience!: string | null;

  @Column({ name: 'physical_condition', type: 'text', nullable: true })
  physicalCondition!: string | null;

  @Column({ name: 'declared_skills', type: 'text', nullable: true })
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
  campId!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ADMISSION_REQUEST_STATUS_VALUES,
    enumName: 'admission_request_status_enum',
    default: 'PENDING_AI',
  })
  status!: AdmissionRequestStatus;

  @Column({ name: 'suggested_occupation_id', type: 'int', nullable: true })
  suggestedOccupationId!: number | null;

  @Column({ name: 'final_occupation_id', type: 'int', nullable: true })
  finalOccupationId!: number | null;

  @Column({ name: 'occupation_modified', type: 'boolean', default: false })
  occupationModified!: boolean;

  @Column({ name: 'reviewed_by', type: 'int', nullable: true })
  reviewedBy!: number | null;

  @Column({ name: 'review_date', type: 'timestamptz', nullable: true })
  reviewDate!: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt!: Date;
}
