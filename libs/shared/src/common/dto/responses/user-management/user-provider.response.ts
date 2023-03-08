import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDate, IsString, IsOptional } from 'class-validator';

export class UserProviderResponse {
  @ApiProperty({ description: "Provider's id", example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  id: string;

  @ApiProperty({
    description: "User's id",
    example: '0d89a63b-3b8a-4722-8442-9f651242fd88',
  })
  @IsUUID(4)
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: "Provider's name", example: 'facebook' })
  @IsString()
  name: string;

  @ApiProperty({ description: "Provider's key", example: 'kn34jfbhubfhf3nr4kjn43k' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;
}
