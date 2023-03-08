import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleUrlResponse {
  @ApiProperty({ example: 'https://accounts.google.com/o/oauth2/v2/auth?acces...' })
  consentUrl: string;
}

export class LoginWithGoogle {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;
}

export class GoogleUrlRequest {
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}
