import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class UserFindDto {
  @ApiPropertyOptional({ example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba', description: 'User ID' })
  @IsUUID(4)
  id?: string;

  @ApiPropertyOptional({ example: 'user@mail.com', description: 'User email' })
  @IsEmail()
  email?: string;

  withSessions?: string;
}
