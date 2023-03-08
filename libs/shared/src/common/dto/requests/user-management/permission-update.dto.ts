import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class PermissionUpdateDto {
  @ApiPropertyOptional({
    description: 'Permission ID',
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: 'Permission name', example: 'view_users' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
