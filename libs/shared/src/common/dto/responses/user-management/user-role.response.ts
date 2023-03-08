import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRoleResponse {
  @ApiProperty({ description: 'User id', example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  userId: string;

  @ApiProperty({ description: 'Role id', example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  roleId: string;
}
