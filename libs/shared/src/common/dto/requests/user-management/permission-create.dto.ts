import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionCreateDto {
  @ApiProperty({ description: 'Permission name', example: 'view_users' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
