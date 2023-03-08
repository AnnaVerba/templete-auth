import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { EmailDto } from './email.dto';

export class SignInDto extends EmailDto {
  @ApiProperty({ example: 'password' })
  @IsString()
  @Length(6, 40)
  password: string;
}

export class SignInMetaDto extends EmailDto {
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @Length(6, 40)
  password: string;
}
