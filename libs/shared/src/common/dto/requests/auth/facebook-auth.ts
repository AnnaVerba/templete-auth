import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FacebookUrlResponse {
  @ApiProperty({ example: 'https://www.facebook.com/v15.0/dialog/oauth?clie...' })
  consentUrl: string;
}

export class LoginWithFacebook {
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

export class FacebookUrlRequest {
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}
