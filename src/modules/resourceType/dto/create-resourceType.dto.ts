import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { ResourceCategory } from '../resourceType.model';

export class CreateResourceTypeDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  unitOfMeasure!: string;

  @ApiProperty()
  category!: ResourceCategory;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;
}
