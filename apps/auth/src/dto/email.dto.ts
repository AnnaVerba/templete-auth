import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { transformEmail } from '@app/shared';

export class EmailDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @Transform(transformEmail)
  email: string;
}
