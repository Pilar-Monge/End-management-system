import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestResourceDetailDto {
  @ApiProperty()
  requestId!:  number;

  @ApiProperty()
  resourceTypeId!:  number;

  @ApiProperty()
  requestedAmount!:  string;

  @ApiPropertyOptional({ nullable: true })
  approvedAmount?: string | null;

}