import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { PersonDetailStatus, PersonDetailType } from '../requestPersonDetail.model';

export class CreateRequestPersonDetailDto {
  @ApiProperty()
  requestId!: number;

  @ApiPropertyOptional()
  detailType?: PersonDetailType;

  @ApiPropertyOptional({ nullable: true })
  personId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  occupationId?: number | null;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  status?: PersonDetailStatus;
}
