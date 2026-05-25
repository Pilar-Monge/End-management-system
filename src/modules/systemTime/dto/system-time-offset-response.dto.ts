import { ApiProperty } from '@nestjs/swagger';

export class SystemTimeOffsetResponseDto {
  @ApiProperty({
    type: 'number',
    description: 'Total time offset in milliseconds',
    example: 7200000,
  })
  offsetMilliseconds!: number;

  @ApiProperty({
    type: 'string',
    description: 'Current system time with offset applied',
    example: '2026-05-11T14:30:00.000Z',
  })
  currentSystemTime!: string;

  @ApiProperty({
    type: 'string',
    description: 'When the offset was last modified',
    example: '2026-05-11T12:30:00.000Z',
  })
  lastModifiedAt!: string;

  @ApiProperty({
    type: 'string',
    description: 'Description of the change applied',
    example: 'Advanced system time by 2 hours',
  })
  message!: string;
}
