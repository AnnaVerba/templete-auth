import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { emailType } from '@app/shared/mailing';

export class SendMessageDto {
  @IsNotEmpty()
  to: emailType;

  @IsEmail()
  @MaxLength(320)
  from: string;

  @MaxLength(998)
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  html?: string;
}
