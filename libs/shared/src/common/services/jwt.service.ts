import { Injectable } from '@nestjs/common';
import { JwtService as JWT, JwtSignOptions } from '@nestjs/jwt';
import { PayloadTokenType, TokenConfigType, TokenResponse } from '../';

@Injectable()
export class JwtService extends JWT {
  private readonly refreshTokenOption: JwtSignOptions;

  constructor(accessTokenOptions: TokenConfigType, refreshTokenOptions: JwtSignOptions) {
    const { secret, expiresIn } = accessTokenOptions;
    super({ secret, signOptions: { expiresIn } });
    this.refreshTokenOption = refreshTokenOptions;
  }

  signToken(data: PayloadTokenType, options?: JwtSignOptions): string {
    return this.sign(data, options);
  }

  verifyToken(token: string, options?: JwtSignOptions): PayloadTokenType {
    return this.verify(token, options);
  }

  generateAccessToken(data: PayloadTokenType): string {
    return this.signToken(data);
  }

  verifyAccess(token: string): PayloadTokenType {
    return this.verifyToken(token);
  }

  generateRefreshToken(data: PayloadTokenType): string {
    return this.signToken(data, this.refreshTokenOption);
  }

  verifyRefresh(token: string): PayloadTokenType {
    return this.verifyToken(token, this.refreshTokenOption);
  }

  generateTokens(data: PayloadTokenType): TokenResponse {
    return {
      accessToken: this.generateAccessToken(data),
      refreshToken: this.generateRefreshToken(data),
    };
  }

  decodeToken<T>(token: string): T {
    return this.decode(token) as T;
  }
}
