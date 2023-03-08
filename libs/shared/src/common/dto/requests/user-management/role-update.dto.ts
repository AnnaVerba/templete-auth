import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RoleUpdateDto {
  @ApiProperty({ description: 'Role ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
