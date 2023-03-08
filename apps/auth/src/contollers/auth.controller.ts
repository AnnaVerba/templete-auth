import { Controller } from '@nestjs/common';
import { AuthService } from '../services';
import { MessagePattern } from '@nestjs/microservices';
import { AccessTokenResponse, AuthMessagePatternEnum } from '@app/shared';

import {
  RecoveryPasswordDto,
  TokenResponse,
  LoginTokenMetaDto,
  LogoutMetaDto,
  EmailMetaDto,
  SignUpMetaDto,
  SignInMetaDto,
  GoogleUrlRequest,
  GoogleUrlResponse,
  LoginWithGoogle,
  FacebookUrlRequest,
  FacebookUrlResponse,
  LoginWithFacebook,
} from '@app/shared/common/dto/requests/auth';
import { RefreshMetaDto } from '@app/shared/common/dto/requests/auth/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthMessagePatternEnum.verifyEmail)
  async verifyAccess(dto: EmailMetaDto): Promise<void> {
    return this.authService.verifyEmail(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.signUp)
  async signUp(dto: SignUpMetaDto): Promise<TokenResponse> {
    return this.authService.signUp(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.signIn)
  async signIn(dto: SignInMetaDto): Promise<AccessTokenResponse> {
    return this.authService.signIn(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.signInWithEmail)
  async signInWithEmail(dto: EmailMetaDto): Promise<void> {
    return this.authService.signInWithEmail(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.verifyLoginToken)
  async verifyLoginToken(dto: LoginTokenMetaDto): Promise<TokenResponse> {
    return this.authService.verifyLoginToken(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.forgotPassword)
  async forgotPassword(dto: EmailMetaDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.recoveryPassword)
  async recoveryPassword({
    recoveryToken,
    password,
    ipAddress,
    userAgent,
  }: RecoveryPasswordDto): Promise<TokenResponse> {
    return this.authService.recoveryPassword(recoveryToken, password, ipAddress, userAgent);
  }

  @MessagePattern(AuthMessagePatternEnum.logout)
  async logout(dto: LogoutMetaDto): Promise<void> {
    return this.authService.logout(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.refresh)
  async refresh(dto: RefreshMetaDto): Promise<AccessTokenResponse> {
    return this.authService.refresh(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.getGoogleAuthUrl)
  async getGoogleAuthUrl(dto: GoogleUrlRequest): Promise<GoogleUrlResponse> {
    return this.authService.getGoogleAuthUrl(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.loginWithGoogle)
  async loginWithGoogle(dto: LoginWithGoogle): Promise<TokenResponse> {
    return this.authService.loginWithGoogle(dto);
  }

  @MessagePattern(AuthMessagePatternEnum.getFacebookAuthUrl)
  async getFacebookAuthUrl({ ipAddress }: FacebookUrlRequest): Promise<FacebookUrlResponse> {
    return this.authService.getFacebookAuthUrl(ipAddress);
  }

  @MessagePattern(AuthMessagePatternEnum.loginWithFacebook)
  async loginWithFacebook({ code, state, ipAddress, userAgent }: LoginWithFacebook): Promise<TokenResponse> {
    return this.authService.loginWithFacebook({ code, state, ipAddress, userAgent });
  }
}
