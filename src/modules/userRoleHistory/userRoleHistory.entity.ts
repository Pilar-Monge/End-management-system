import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import {
  SYSTEM_ROLE_VALUES,
  type SystemRole,
} from '../systemUser/systemUser.model';
@Entity({ name: 'user_role_history' })
@Index('idx_historial_rol_usuario', ['userId', 'changeDate'])
@Index('idx_historial_rol_usuario_por', ['changedBy'])
export class UserRoleHistoryEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  @ApiProperty()
  userId!: number;

  @Column({
    name: 'rol_anterior',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
  })
  @ApiProperty({ enum: SYSTEM_ROLE_VALUES })
  previousRole!: SystemRole;

  @Column({
    name: 'rol_nuevo',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
  })
  @ApiProperty({ enum: SYSTEM_ROLE_VALUES })
  newRole!: SystemRole;

  @Column({ name: 'changed_by', type: 'int' })
  @ApiProperty()
  changedBy!: number;

  @Column({
    name: 'change_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  changeDate!: Date;

  @Column({ name: 'reason', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  reason!: string | null;
}
