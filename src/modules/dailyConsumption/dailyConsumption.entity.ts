import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { DAILY_CONSUMPTION_TYPE_VALUES, type DailyConsumptionType } from './dailyConsumption.model';

@Entity({ name: 'daily_consumption' })
@Index('idx_daily_consumption_fecha', ['fecha'])
@Index('idx_daily_consumption_campamento', ['campamentoId'])
export class DailyConsumptionEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'fecha', type: 'timestamptz', default: () => 'NOW()' })
  @ApiProperty()
  fecha!: Date;

  @Column({ name: 'campamento_id', type: 'int' })
  @ApiProperty()
  campamentoId!: number;

  @Column({ name: 'recurso_id', type: 'int' })
  @ApiProperty()
  recursoId!: number;

  @Column({ name: 'cantidad', type: 'numeric', precision: 12, scale: 2 })
  @ApiProperty()
  cantidad!: string;

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: DAILY_CONSUMPTION_TYPE_VALUES,
    enumName: 'daily_consumption_type_enum',
  })
  @ApiProperty({ enum: DAILY_CONSUMPTION_TYPE_VALUES })
  tipo!: DailyConsumptionType;
}
