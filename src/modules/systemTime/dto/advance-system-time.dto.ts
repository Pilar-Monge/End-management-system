import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, Min } from 'class-validator';

export enum TimeUnit {
  HOURS = 'hours',
  MINUTES = 'minutes',
}

export class AdvanceSystemTimeDto {
  @ApiProperty({
    enum: TimeUnit,
    description: 'Unit of time to advance: hours or minutes',
    example: 'hours',
  })
  @IsEnum(TimeUnit, {
    message: 'Unit must be either "hours" or "minutes"',
  })
  unit!: TimeUnit;

  @ApiProperty({
    type: 'number',
    description: 'Amount of time to advance in the specified unit',
    example: 2,
    minimum: 0.01,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Amount must be a valid number' },
  )
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount!: number;
}
