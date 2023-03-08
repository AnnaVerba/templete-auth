import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserProviderCreateDto {
  @ApiProperty({ example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba', description: 'User ID' })
  @IsUUID(4)
  userId: string;

  @ApiProperty({ example: 'facebook', description: 'Provider Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'kn34jfbhubfhf3nr4kjn43k', description: 'Provider access token' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
