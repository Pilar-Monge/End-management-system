import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRequestResourceDetailDto {
  @ApiPropertyOptional()
  requestId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  requestedAmount?: string;

  @ApiPropertyOptional({ nullable: true })
  approvedAmount?: string | null;
}
