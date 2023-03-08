import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FacebookUrlResponse {
  @ApiProperty({ example: 'https://www.facebook.com/v15.0/dialog/oauth?clie...' })
  @IsString()
  @IsNotEmpty()
  consentUrl: string;
}

export interface LoginWithFacebook {
  code: string;
  state: string;
  ipAddress: string;
}

export interface FacebookUrlRequest {
  ipAddress: string;
}
