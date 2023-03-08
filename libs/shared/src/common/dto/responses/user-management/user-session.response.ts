import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIP, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';

export class UserSessionResponse {
  @ApiProperty({
    description: "Session's id",
    example: '0d89a63b-3b8a-4722-8442-9f651242fd88',
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({
    description: "User's id",
    example: '0d89a63b-3b8a-4722-8442-9f651242fd88',
  })
  @IsUUID(4)
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: "Session's ip address", example: '127.0.0.1' })
  @IsIP()
  ipAddress: string;

  @ApiProperty({ description: "Session's os info", example: 'macOS 9.2.1 STABLE' })
  @IsString()
  osInfo: string;

  @ApiProperty({ description: "Session's active status", example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'Updated at', example: null })
  @IsDate()
  expiredAt: Date;
}
