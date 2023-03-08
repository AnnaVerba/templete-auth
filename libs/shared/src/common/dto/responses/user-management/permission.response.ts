import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDate } from 'class-validator';

export class PermissionResponse {
  @ApiProperty({ description: "Permission's id", example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: "Permission's name", example: 'view_users' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;
}
