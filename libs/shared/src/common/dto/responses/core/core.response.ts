import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CoreResponse {
  @ApiProperty({ example: 200 })
  @IsNumber()
  code: number;

  @ApiProperty({ example: 'Follow your email and complete registration' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  data: any;

  @ApiProperty({ example: 1_630_931_855_146 })
  @IsNumber()
  timestamp: number;
}
