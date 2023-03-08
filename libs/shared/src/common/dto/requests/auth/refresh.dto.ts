import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshMetaDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
