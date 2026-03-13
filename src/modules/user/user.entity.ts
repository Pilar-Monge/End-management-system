import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import {
  SYSTEM_ROLE_VALUES,
  USER_STATUS_VALUES,
  type SystemRole,
  type UserStatus,
} from './user.model';

@Entity({ name: 'system_user' })
@Unique('uq_usuario_username_camp', ['campId', 'username'])
@Unique('uq_usuario_correo_camp', ['campId', 'email'])
@Unique('uq_user_person', ['personId'])
@Unique('uq_usuario_solicitud', ['requestId'])
@Index('idx_user_camp_id', ['campId'])
@Index('idx_usuario_rol', ['role'])
@Index('idx_usuario_estado', ['status'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'person_id', type: 'int' })
  personId!: number;

  @Column({ name: 'request_id', type: 'int' })
  requestId!: number;

  @Column({ name: 'username', type: 'text' })
  username!: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string;

  @Column({ name: 'email', type: 'text' })
  email!: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: USER_STATUS_VALUES,
    enumName: 'user_status_enum',
    default: 'ACTIVE',
  })
  status!: UserStatus;

  @Column({
    name: 'role',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
    default: 'VISITOR',
  })
  role!: SystemRole;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

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
