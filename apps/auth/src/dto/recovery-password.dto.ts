import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class RecoveryPasswordDto extends PickType(SignInDto, ['password'] as const) {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e' })
  @IsString()
  @IsNotEmpty()
  recoveryToken: string;
}
