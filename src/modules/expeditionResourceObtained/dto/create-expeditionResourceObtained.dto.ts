import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpeditionResourceObtainedDto {
  @ApiProperty()
  expeditionId!: number;

  @ApiProperty()
  resourceTypeId!: number;

  @ApiProperty()
  amount!: string;

  @ApiProperty()
  recordedBy!: number;

  @ApiPropertyOptional()
  recordDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;
}
