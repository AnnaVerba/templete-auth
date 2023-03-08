import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends OmitType(SignInDto, ['email'] as const) {
  @ApiProperty({ example: 'Bruce' })
  @IsString()
  @Length(1, 25)
  firstName: string;

  @ApiProperty({ example: 'Adams' })
  @IsString()
  @Length(1, 25)
  lastName: string;

  @ApiPropertyOptional({ example: '+380977777777' })
  @IsOptional()
  @IsPhoneNumber(null)
  phone: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e' })
  @IsString()
  @IsNotEmpty()
  verifyToken: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
