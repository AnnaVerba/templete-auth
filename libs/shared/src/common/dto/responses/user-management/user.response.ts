import { Role, UserProfile, UserProvider, UserSession } from '@app/shared/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID, IsDate, IsString, IsBoolean } from 'class-validator';
import { UserProfileResponse } from '@app/shared/common';
import { UserSessionResponse } from '@app/shared/common';
import { UserProviderResponse } from '@app/shared/common';

export class UserResponse {
  @ApiProperty({ description: "User's id", example: '0d89a63b-3b8a-4722-8442-9f651242fd88' })
  @IsUUID(4)
  id: string;

  @ApiProperty({ description: "User's email", example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    example: '$2a$10$pd6hO5zgKHjJeBYTn2Bviu6aOqZnuMp0i4Uyh2Y0FXcavBfMGyMN2',
  })
  @IsString()
  password: string;

  @ApiProperty({ description: "User's verify status", example: true })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({ description: "User's ban status", example: false })
  @IsBoolean()
  isBanned: boolean;

  @ApiProperty({ description: 'Created at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2022-12-29 14:47:20.374+02' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ type: UserProfileResponse, description: "User's profile" })
  profile: UserProfile;

  @ApiProperty({ type: UserSessionResponse, description: "User's sessions", isArray: true })
  sessions: UserSession[];

  @ApiProperty({ type: UserProviderResponse, description: "User's providers", isArray: true })
  providers: UserProvider[];

  @ApiProperty({ type: Role, description: "User's roles", example: [], isArray: true })
  roles: Role[];
}
