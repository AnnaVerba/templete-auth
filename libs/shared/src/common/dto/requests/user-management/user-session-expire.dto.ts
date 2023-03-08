import { IsNotEmpty } from 'class-validator';

// Not for swagger.
// Local DTO

export class ExpireSessionDto {
  @IsNotEmpty()
  expiredAt: Date;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  refreshToken: null;
}
