import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UserProviderUpdateDto {
  @ApiProperty({ description: 'Provider ID', example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba' })
  @IsUUID(4)
  id: string;

  @ApiPropertyOptional({ description: 'Provider name', example: 'google' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Provider key', example: 'kn34jfbhubfhf3nr4kjn43k' })
  @IsOptional()
  @IsString()
  key?: string;
}
