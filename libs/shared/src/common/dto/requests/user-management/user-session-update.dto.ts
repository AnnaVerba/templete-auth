import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserSessionUpdateDto {
  @ApiProperty({ description: 'Session ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: 'Refresh token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e' })
  @IsNotEmpty()
  refreshToken: string;
}
