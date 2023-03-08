import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'password', description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'first', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'last', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
