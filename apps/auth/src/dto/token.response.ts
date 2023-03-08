import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class TokenResponse extends AccessTokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
