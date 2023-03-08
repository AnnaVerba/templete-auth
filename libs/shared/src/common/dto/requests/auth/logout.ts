import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutMetaDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
