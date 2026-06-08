import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransferTransportStaffDto {
  @ApiProperty({ type: [Number] })
  transportPersonIds!: number[];
}