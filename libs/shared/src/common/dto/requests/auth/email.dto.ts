import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { transformEmail } from '@app/shared';

export class EmailDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @Transform(transformEmail)
  email: string;
}

export class EmailMetaDto {
  @IsEmail()
  @Transform(transformEmail)
  email: string;

  @IsString()
  @IsNotEmpty()
  origin: string;
}
