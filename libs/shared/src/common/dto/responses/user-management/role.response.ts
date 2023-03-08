import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { Permission, User } from '@app/shared/models';

export class RoleResponse {
  @ApiProperty({ description: "Role's id", example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: "Role's name", example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({ description: "Role's permissions", isArray: true })
  permissions: Permission[];

  @ApiProperty({ description: "Role's users", isArray: true })
  users: User[];

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;
}
