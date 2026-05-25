import { ApiPropertyOptional } from '@nestjs/swagger';

import type { ResourceCategory } from '../resourceType.model';

export class UpdateResourceTypeDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  unitOfMeasure?: string;

  @ApiPropertyOptional()
  category?: ResourceCategory;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;
}
