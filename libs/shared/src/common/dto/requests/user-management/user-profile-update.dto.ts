import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, IsUUID, IsUrl } from 'class-validator';

export class UserProfileUpdateDto {
  @ApiProperty({ example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba', description: 'User ID' })
  @IsUUID(4)
  id: string;

  @ApiPropertyOptional({ example: 'first', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'last', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+38063XXXXXXX', description: 'Phone number' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    example:
      'https://help.apple.com/assets/6348318B9C14DE7E263A6023/6348319C9C14DE7E263A602B/en_GB/4c67739b6968c3b00c942e2703873d33.png',
    description: 'Url to avatar',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
