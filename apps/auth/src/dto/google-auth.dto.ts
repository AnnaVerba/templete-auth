import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleUrlResponse {
  @ApiProperty({ example: 'https://accounts.google.com/o/oauth2/v2/auth?acces...' })
  @IsString()
  @IsNotEmpty()
  consentUrl: string;
}

export interface LoginWithGoogle {
  code: string;
  state: string;
  ipAddress: string;
}

export interface GoogleUrlRequest {
  ipAddress: string;
}
