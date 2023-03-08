import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserRoleCreateDto {
  @ApiProperty({ description: 'User ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  userId: string;

  @ApiProperty({ description: 'Role ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  roleId: string;
}
