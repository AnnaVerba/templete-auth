import {
  AccessTokenResponse,
  AuthMessagePatternEnum,
  AuthUser,
  CoreApiResponse,
  CoreResponse,
  FacebookUrlRequest,
  FacebookUrlResponse,
  httpUser,
  LoginWithFacebook,
  LoginWithGoogle,
  MicroServicesEnum,
  origin,
  TokenTypeEnum,
} from '@app/shared';

import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Get, Res, Req, UseGuards, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { lastValueFrom } from 'rxjs';
import {
  EmailDto,
  LoginTokenDto,
  RecoveryPasswordDto,
  SignInDto,
  SignUpDto,
  TokenResponse,
  LoginTokenMetaDto,
  LogoutMetaDto,
  EmailMetaDto,
  SignUpMetaDto,
  SignInMetaDto,
  GoogleUrlRequest,
  GoogleUrlResponse,
} from '@app/shared/common/dto/requests/auth';
import { RefreshGuard } from '../guards';
import * as dayjs from 'dayjs';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { HttpAuthGuard } from '../guards';
import { RefreshMetaDto } from '@app/shared/common/dto/requests/auth/refresh.dto';
import { httpUserInfo } from '@app/shared/common/decorators/param/user-info.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configFacade: ConfigFacade,
    @Inject(MicroServicesEnum.AUTH_MS)
    private readonly authService: ClientProxy,
  ) {}

  private async getCookieConfig(): Promise<CookieSerializeOptions> {
    const refreshExpireTime = await this.configFacade.get('REFRESH_TOKEN_EXPIRE_TIME');
    const value = Number.parseInt(refreshExpireTime);
    const unit = refreshExpireTime.slice(String(value).length);

    return {
      httpOnly: true,
      path: '/auth/refresh',
      expires: dayjs().add(value, unit).toDate(),
      sameSite: 'none',
      secure: true,
    };
  }

  @Post('verifyEmail')
  @ApiOkResponse({ type: CoreResponse })
  @HttpCode(HttpStatus.OK)
  async verifyAccess(@Body() { email }: EmailDto, @origin() origin: string): Promise<CoreResponse> {
    await lastValueFrom(
      this.authService.send<void, EmailMetaDto>(AuthMessagePatternEnum.verifyEmail, {
        email,
        origin,
      }),
      { defaultValue: 0 },
    );

    return CoreApiResponse.success({
      message: `Follow your ${email} address and complete registration`,
    });
  }

  @Post('signUp')
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, SignUpMetaDto>(AuthMessagePatternEnum.signUp, {
        ...userInfo,
        ...signUpDto,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Post('signIn')
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, SignInMetaDto>(AuthMessagePatternEnum.signIn, {
        ...userInfo,
        ...dto,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Post('signInWithEmail')
  @ApiOkResponse({ type: CoreResponse })
  @HttpCode(HttpStatus.OK)
  async signInWithEmail(@Body() dto: EmailDto, @origin() origin: string): Promise<CoreResponse> {
    await lastValueFrom(
      this.authService.send<void, EmailMetaDto>(AuthMessagePatternEnum.signInWithEmail, {
        ...dto,
        origin,
      }),
      { defaultValue: 0 },
    );

    return CoreApiResponse.success({
      message: `Follow your ${dto.email} address and complete login`,
    });
  }

  @Post('verifyLoginToken')
  @ApiOkResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async verifyLoginToken(
    @Body() dto: LoginTokenDto,
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, LoginTokenMetaDto>(AuthMessagePatternEnum.verifyLoginToken, {
        ...userInfo,
        ...dto,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Post('forgotPassword')
  @ApiOkResponse({ type: CoreResponse })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { email }: EmailDto, @origin() origin: string): Promise<CoreResponse> {
    await lastValueFrom(
      this.authService.send<void, EmailMetaDto>(AuthMessagePatternEnum.forgotPassword, {
        email,
        origin,
      }),
      { defaultValue: 0 },
    );

    return CoreApiResponse.success({
      message: `Follow your ${email} address and complete recovery password`,
    });
  }

  @Post('recoveryPassword')
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async recoveryPassword(
    @Body() { recoveryToken, password },
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, RecoveryPasswordDto>(AuthMessagePatternEnum.recoveryPassword, {
        recoveryToken,
        password,
        ...userInfo,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  @ApiResponse({ type: CoreResponse })
  @HttpCode(HttpStatus.CREATED)
  async logout(
    @httpUser() user: AuthUser,
    @Res({ passthrough: true }) reply: FastifyReply,
    @Req() req: FastifyRequest,
  ): Promise<CoreResponse> {
    await lastValueFrom(
      this.authService.send<void, LogoutMetaDto>(AuthMessagePatternEnum.logout, {
        sessionId: user.currentSessionId,
      }),
      {
        defaultValue: 0,
      },
    );
    reply.clearCookie(TokenTypeEnum.refreshToken);

    return CoreApiResponse.created('loggedOut', 'loggedOut');
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async refresh(
    @httpUser() user: AuthUser,
    @Res({ passthrough: true }) reply: FastifyReply,
    @Req() req: FastifyRequest,
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, RefreshMetaDto>(AuthMessagePatternEnum.refresh, {
        userId: user.id,
        sessionId: user.currentSessionId,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Get('googleAuthUrl')
  @ApiResponse({ type: GoogleUrlResponse, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async getGoogleAuthUrl(
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<GoogleUrlResponse> {
    return await lastValueFrom(
      this.authService.send<GoogleUrlResponse, GoogleUrlRequest>(AuthMessagePatternEnum.getGoogleAuthUrl, {
        ipAddress: userInfo.ipAddress,
      }),
    );
  }

  @Get('loginWithGoogle')
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async loginWithGoogle(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, LoginWithGoogle>(AuthMessagePatternEnum.loginWithGoogle, {
        code,
        state,
        ...userInfo,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }

  @Get('facebookAuthUrl')
  @ApiResponse({ type: FacebookUrlResponse, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async getFacebookAuthUrl(
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<FacebookUrlResponse> {
    return await lastValueFrom(
      this.authService.send<FacebookUrlResponse, FacebookUrlRequest>(AuthMessagePatternEnum.getFacebookAuthUrl, {
        ipAddress: userInfo.ipAddress,
      }),
    );
  }

  @Get('loginWithFacebook')
  @ApiResponse({ type: AccessTokenResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async loginWithFacebook(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) reply: FastifyReply,
    @httpUserInfo() userInfo: { ipAddress: string; userAgent: string },
  ): Promise<AccessTokenResponse> {
    const tokenResponse = await lastValueFrom(
      this.authService.send<TokenResponse, LoginWithFacebook>(AuthMessagePatternEnum.loginWithFacebook, {
        code,
        state,
        ...userInfo,
      }),
    );
    reply.cookie(TokenTypeEnum.refreshToken, tokenResponse.refreshToken, await this.getCookieConfig());
    return { accessToken: tokenResponse.accessToken };
  }
}
