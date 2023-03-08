import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDate, IsString, IsPhoneNumber, IsUrl } from 'class-validator';

export class UserProfileResponse {
  @ApiProperty({
    description: "User profile's id",
    example: '0d89a63b-3b8a-4722-8442-9f651242fd88',
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: "User's first name", example: 'first' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "User's last name", example: 'last' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "User's phone number", example: '+38096XXXXXXX' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: "User's avatar",
    example:
      'https://help.apple.com/assets/6348318B9C14DE7E263A6023/6348319C9C14DE7E263A602B/en_GB/4c67739b6968c3b00c942e2703873d33.png',
  })
  @IsUrl()
  avatar: string;

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;
}
