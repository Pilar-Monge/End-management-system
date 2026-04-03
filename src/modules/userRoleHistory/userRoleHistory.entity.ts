import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { SYSTEM_ROLE_VALUES, type SystemRole } from '../systemUser/systemUser.model';

@Entity({ name: 'user_role_history' })
@Index('idx_historial_rol_usuario', ['userId', 'changeDate'])
@Index('idx_historial_rol_usuario_por', ['changedBy'])
export class UserRoleHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({
    name: 'rol_anterior',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
  })
  previousRole!: SystemRole;

  @Column({
    name: 'rol_nuevo',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
  })
  newRole!: SystemRole;

  @Column({ name: 'changed_by', type: 'int' })
  changedBy!: number;

  @Column({
    name: 'change_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  changeDate!: Date;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason!: string | null;
}
