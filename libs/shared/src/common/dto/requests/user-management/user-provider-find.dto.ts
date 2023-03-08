import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserProviderFindDto {
  @ApiProperty({ example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba', description: 'Provider ID' })
  @IsUUID(4)
  id?: string;

  @IsUUID(4)
  userId?: string;
}
