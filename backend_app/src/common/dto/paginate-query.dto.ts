import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class PaginateQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number;
  path: string;
  removed: false;
}
