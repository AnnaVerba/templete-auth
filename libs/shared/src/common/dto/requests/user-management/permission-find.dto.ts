import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class PermissionFindDto {
  @ApiProperty({ description: 'Permission ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
