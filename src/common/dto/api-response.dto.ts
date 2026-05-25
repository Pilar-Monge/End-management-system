import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type JsonObject = Record<string, unknown>;

export class PaginationDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pages!: number;
}

export class SuccessMessageResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiPropertyOptional()
  message?: string;
}

export class SuccessDataResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: Object })
  data!: JsonObject;

  @ApiPropertyOptional()
  message?: string;
}

export class SuccessListResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: [Object] })
  data!: JsonObject[];

  @ApiPropertyOptional({ type: PaginationDto })
  pagination?: PaginationDto;

  @ApiPropertyOptional()
  message?: string;
}
