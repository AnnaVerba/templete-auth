import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({ description: 'Role name', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Array of permissions for new role',
    example: '["view_users", "edit_users"]',
  })
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}
