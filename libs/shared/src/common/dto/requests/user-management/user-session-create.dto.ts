import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIP, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserSessionCreateDto {
  @ApiProperty({ description: "User's id", example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  userId: string;

  @ApiProperty({ description: "User's ip address", example: '127.0.0.1' })
  @IsIP()
  ipAddress: string;

  @ApiProperty({ description: "User's operating system info", example: 'macOS 9.2.1 STABLE' })
  @IsString()
  @IsNotEmpty()
  osInfo: string;

  @ApiPropertyOptional({
    description: 'Refresh Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
