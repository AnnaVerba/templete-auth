import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { EmailDto } from './email.dto';

export class SignInDto extends EmailDto {
  @ApiProperty({ example: 'password' })
  @IsString()
  @Length(6, 40)
  password: string;
}
