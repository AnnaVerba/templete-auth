import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({ example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba', description: 'User ID' })
  @IsUUID(4)
  id?: string;

  @ApiPropertyOptional({ example: 'test@test.com', description: 'User email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'password', description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;
}
