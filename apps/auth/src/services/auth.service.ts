import { Injectable, Logger, LoggerService, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  JwtService,
  BcryptService,
  MicroServicesEnum,
  DeliveryMessagePatternEnum,
  User,
  GoogleProfileInfo,
  FacebookProfileInfo,
  AuthSessionRepository,
  UserManagementMessagePatternEnum,
  UserFindDto,
  UserCreateDto,
  UserProfileUpdateDto,
  UserSessionCreateDto,
  UserSessionUpdateDto,
  UserSessionFindDto,
  LoginWithGoogle,
  UserProviderCreateDto,
  GoogleUrlRequest,
  UserSession,
  WithSessionsEnums,
  UserUpdateDto,
  UserProviderFindDto,
  UserProvider,
  UserProfile,
} from '@app/shared';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import NamedRpcException from '@app/shared/common/exceptions/named-rpc.exception';
import { GoogleAuthService } from '../providers/google/google-auth.service';
import { FacebookAuthService } from '../providers/facebook/facebook-auth.service';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import {
  EmailMetaDto,
  LoginTokenMetaDto,
  LogoutMetaDto,
  SignInMetaDto,
  SignUpMetaDto,
  GoogleUrlResponse,
  FacebookUrlResponse,
  TokenResponse,
} from '@app/shared/common/dto/requests/auth';
import { RefreshMetaDto } from '@app/shared/common/dto/requests/auth/refresh.dto';
import { AuthProviders } from '../providers/providers';

@Injectable()
export class AuthService {
  logger: LoggerService;

  constructor(
    readonly configFacade: ConfigFacade,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private googleAuthService: GoogleAuthService,
    private facebookAuthService: FacebookAuthService,
    private authSessionRepository: AuthSessionRepository,
    @Inject(MicroServicesEnum.DELIVERY_MS) private mailService: ClientProxy,
    @Inject(MicroServicesEnum.USERMANAGEMENT_MS) private userClient: ClientProxy,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * Checks if the email does not yet exist in db. Creates JWT token with the email
   * as a payload. Generates an url with this token in query params. Sends these
   * email and url to DELIVERY microservice for further sending to user via email
   */
  async verifyEmail({ email, origin }: EmailMetaDto): Promise<void> {
    const user = await this.findUserByEmail(email);

    if (user) {
      throw new RpcException('AlreadyExists');
    }

    const verifyToken = this.jwtService.signToken({ email });

    const url = `${origin}/auth/signUp?verifyToken=${verifyToken}`;
    const wasMailSent = lastValueFrom(
      this.mailService.send<boolean, { email: string; url: string }>(DeliveryMessagePatternEnum.sendEmail, {
        email,
        url,
      }),
    );

    if (!wasMailSent) {
      throw new InternalServerErrorException('Verification email has not been sent');
    }
  }

  /**
   * Verifies the verification token and extracts an email out of it. Checks if
   * a user with this email does not exist yet. Creates a hash of the given password.
   * Creates a new record with given information in a database. Creates a new
   * session for the user and return respective access and refresh tokens
   */
  async signUp({
    ipAddress,
    userAgent,
    firstName,
    lastName,
    phone,
    verifyToken,
    password,
  }: SignUpMetaDto): Promise<TokenResponse> {
    const { email } = this.jwtService.verifyToken(verifyToken);

    const user = await this.findUserByEmail(email);

    if (user) {
      throw new RpcException('AlreadyExists');
    }
    const newUser = await this.createUser({
      email,
      password,
      firstName,
      lastName,
    });
    await this.updateProfile({ id: newUser.id, phone });

    return this.createSession(newUser.id, ipAddress, userAgent);
  }

  /** Checks if a user with the email exists. Checks if the given password matches
   * the one of the user. Creates a new session for the user, and returns respective
   * access and refresh tokens
   */
  async signIn({ ipAddress, userAgent, email, password }: SignInMetaDto): Promise<TokenResponse> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new RpcException('NotFound');
    }

    // if this profile was created using a third party identity provider
    if (user['password'] === null) {
      throw new RpcException('ImproperAuthenticationMethod');
    }
    await this.bcryptService.compare(password, user['password']);

    // expire current user's session
    const userActiveSessions = await this.getActiveSessions({ id: user['id'], withSessions: WithSessionsEnums.Active });

    for (const session of userActiveSessions) {
      if (session.ipAddress === ipAddress) {
        await lastValueFrom(
          this.userClient.send<number, UserSessionFindDto>(UserManagementMessagePatternEnum.expireSession, {
            id: session.id,
          }),
        );
      }
    }

    return this.createSession(user['id'], ipAddress, userAgent);
  }

  /**
   * Checks if a user with the email exists. Generates a temporary token for
   * checking if the user actually owns the email. Generates an url with the token;
   * sends these email and url to DELIVERY microservice for further sending to user
   * via email
   */
  async signInWithEmail({ email, origin }: EmailMetaDto): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new RpcException('NotFound');
    }

    const loginToken = this.jwtService.signToken({ email });

    const url = `${origin}/auth/email?loginToken=${loginToken}`;
    const wasMailSent = await lastValueFrom(
      this.mailService.send<boolean, { email: string; url: string }>(DeliveryMessagePatternEnum.sendEmail, {
        email,
        url,
      }),
    );

    if (!wasMailSent) {
      throw new InternalServerErrorException('Verification email has not been sent');
    }
  }

  /** Verifies the login token (token sent via email), if it is valid, then signs
   * in the user creating a session, else throws error
   */
  async verifyLoginToken({ ipAddress, userAgent, loginToken }: LoginTokenMetaDto): Promise<TokenResponse> {
    const { email } = this.jwtService.verify(loginToken);

    if (!email) {
      throw new RpcException('InvalidToken');
    }

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new RpcException('InvalidToken');
    }

    // expire current user's session
    for (const session of user['sessions']) {
      if (session.isActive === true && session.ipAddress === ipAddress) {
        await lastValueFrom(
          this.userClient.send<number, UserSessionFindDto>(UserManagementMessagePatternEnum.expireSession, {
            id: session.id,
          }),
        );
        break;
      }
    }

    return this.createSession(user['id'], ipAddress, userAgent);
  }

  /** Checks if a user with the email exists. Generates a temporary token for
   * checking if the user actually owns the email. Generates an url with the token;
   * sends these email and url to DELIVERY microservice for further sending to user
   * via email
   */
  async forgotPassword({ email, origin }: EmailMetaDto): Promise<void> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new RpcException('NotFound');
    }

    // if this profile was created using a third party identity provider
    if (user.password === null) {
      throw new RpcException('ImpossibleAction');
    }
    const recoveryToken = this.jwtService.signToken({ email });
    const url = `${origin}/auth/recovery?recoveryToken=${recoveryToken}`;

    const wasMailSent = await lastValueFrom(
      this.mailService.send<boolean, { email: string; url: string }>(DeliveryMessagePatternEnum.sendEmail, {
        email,
        url,
      }),
    );

    if (!wasMailSent) {
      throw new InternalServerErrorException('Verification email has not been sent');
    }
  }

  /** Verifies the recovery token and extracts an email out of it. Creates hash
   * of the new password and updates a user's record in database, setting the new
   * password hash, and updates the user session
   */

  async recoveryPassword(recoveryToken, password, ipAddress, userAgent): Promise<TokenResponse> {
    const { email } = this.jwtService.verify(recoveryToken);

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new RpcException('NotFound');
    }

    await lastValueFrom(
      this.userClient.send<User, UserUpdateDto>(UserManagementMessagePatternEnum.updateUser, {
        id: user.id,
        password,
      }),
    );
    const sessions = this.getActiveSessions({ id: user.id });
    // expire current user's session
    for (const session in sessions) {
      if (session[`isActive`] === true && session[`ipAddress`] === ipAddress) {
        await lastValueFrom(
          this.userClient.send<number, UserSessionFindDto>(UserManagementMessagePatternEnum.expireSession, {
            id: session[`id`],
          }),
        );
        break;
      }
    }
    return this.createSession(user.id, ipAddress, userAgent);
  }

  /** Checks if the given sessionId of a user is valid, and if it is, creates a new
   * session, and returns respective
   * access and refresh tokens
   */
  async refresh({ sessionId, userId }: RefreshMetaDto): Promise<TokenResponse> {
    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: userId,
    });

    await lastValueFrom(
      this.userClient.send<User, UserSessionUpdateDto>(UserManagementMessagePatternEnum.updateSession, {
        id: sessionId,
        refreshToken,
      }),
    );

    return { accessToken, refreshToken };
  }

  /** Expires current user session */
  async logout({ sessionId }: LogoutMetaDto): Promise<void> {
    const result = await lastValueFrom(
      this.userClient.send<number, UserSessionFindDto>(UserManagementMessagePatternEnum.expireSession, {
        id: sessionId,
      }),
    );

    if (!result) {
      throw new RpcException('NotLoggedOut');
    }
  }

  /**
   * Returns an url to google's user consent form, that is to google's login screen.
   * After the user logins, google redirects to the redirection url specified in
   * the project credentials, putting the 'code' query parameter in it, used in the
   * login method. Ip address is needed for checking if the client who initiated an
   * authentication is the one who confirms it
   */
  async getGoogleAuthUrl({ ipAddress }: GoogleUrlRequest): Promise<GoogleUrlResponse> {
    const state = await this.createAuthSession(ipAddress);
    return {
      consentUrl: this.googleAuthService.getGoogleAuthURL(state),
    };
  }

  /**
   * Verifies auth session first. Tries to get user's profile from Google by the
   * code obtained from Google's user consent form, the code was sent in query string
   * parameter in callback url, defined in google console project credentials.
   * If the profile is fetched successfully the method tries to find the user's
   * record in database by email. If found the user's session is updated, else, a
   * new user record is created using info from Google profile. If failed to
   * fetch a profile from Google, then throws an error
   */
  async loginWithGoogle({ code, state, ipAddress, userAgent }: LoginWithGoogle): Promise<TokenResponse> {
    await this.verifyAuthSession(state, ipAddress);

    let googleUser: GoogleProfileInfo;
    try {
      googleUser = await this.googleAuthService.getGoogleUser(code);
    } catch {
      this.throwUnauthorizedException('GoogleAuthInvalidGrant');
    }

    let user = await this.findUserByEmail(googleUser.email);

    let tokenResponse: TokenResponse;
    if (user) {
      // if profile already exists then create a new session

      const hasGoogle = await lastValueFrom(
        this.userClient.send<UserProvider, UserProviderFindDto>(UserManagementMessagePatternEnum.findProviderByUser, {
          userId: user.id,
        }),
      );

      if (!hasGoogle) {
        await this.addAuthProvider({
          userId: user.id,
          name: AuthProviders.Google,
          key: googleUser.id,
        });
      }
      tokenResponse = await this.createSession(user.id, ipAddress, userAgent);
    } else {
      // else create a new user record in a database, and set a new session

      user = await this.createUser({
        email: googleUser.email,
        password: 'sdd',
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
      });

      await this.addAuthProvider({
        userId: user.id,
        name: AuthProviders.Google,
        key: googleUser.id,
      });

      // TODO: check if this needed.
      // if (googleUser.picture) {
      //   await this.updateProfile({ id: user.id, avatar: googleUser.picture });
      // }
      tokenResponse = await this.createSession(user.id, ipAddress, userAgent);
    }
    return tokenResponse;
  }

  /**
   * Returns an url to facebook's user consent form, that is to facebook's login screen.
   * After the user logins, facebook redirects to the redirection url specified in
   * the project credentials, putting the 'code' query parameter in it, used in the
   * login method. Ip address is needed for checking if the client who initiated an
   * authentication is the one who confirms it
   */
  async getFacebookAuthUrl(ipAddress: string): Promise<FacebookUrlResponse> {
    const state = await this.createAuthSession(ipAddress);
    return {
      consentUrl: this.facebookAuthService.getFacebookAuthURL(state),
    };
  }

  /**
   * Verifies auth session first. Then tries to get facebook user's profile from
   * facebook by the code obtained from facebook user's consent form. If failed
   * throws an exception. Then the next logic happens:
   * - if the user's facebook profile has an email specified, tries to get the user
   * from database by the email. If found, updates user's session possibly
   * adding facebookId to the user record. If not found tries to find user by
   * facebookId: if successful - updates session and sets email field to the user's
   *  email, if failed - creates a new user record with given info.
   * - if the user's facebook profile has no email, then tries to get the user from
   * database by facebookId. If found updates its session, else creates a new user
   * record with given information from facebook's profile
   */
  async loginWithFacebook({ code, state, ipAddress, userAgent }): Promise<TokenResponse> {
    await this.verifyAuthSession(state, ipAddress);

    let facebookUser: FacebookProfileInfo;
    try {
      facebookUser = await this.facebookAuthService.getFacebookUser(code);
    } catch {
      this.throwUnauthorizedException('GoogleAuthInvalidGrant');
    }

    let user = await lastValueFrom(
      this.userClient.send<User, UserFindDto>(UserManagementMessagePatternEnum.findUserByEmail, {
        email: facebookUser.email,
      }),
    );

    let tokens: TokenResponse;
    if (user) {
      // if profile already exists then create a new session.
      const hasFacebook = await lastValueFrom(
        this.userClient.send<UserProvider, UserProviderFindDto>(UserManagementMessagePatternEnum.findProviderByUser, {
          userId: user.id,
        }),
      );

      if (!hasFacebook) {
        await this.addAuthProvider({
          userId: user.id,
          name: AuthProviders.Facebook,
          key: facebookUser.id,
        });
      }
      tokens = await this.createSession(user.id, ipAddress, userAgent);
    } else {
      // else create a new user record in a database, and set a new session.
      user = await this.createUser({
        email: facebookUser.email,
        password: 'sdd',
        firstName: facebookUser.first_name,
        lastName: facebookUser.last_name,
      });

      await this.addAuthProvider({
        userId: user.id,
        name: AuthProviders.Facebook,
        key: facebookUser.id,
      });

      // TODO: check if this needed.
      // if (googleUser.picture) {
      //   await this.updateProfile({ id: user.id, avatar: googleUser.picture });
      // }
      tokens = await this.createSession(user.id, ipAddress, userAgent);
    }

    return tokens;
  }

  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<TokenResponse> {
    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: userId,
    });

    await lastValueFrom(
      this.userClient.send<User, UserSessionCreateDto>(UserManagementMessagePatternEnum.addSession, {
        userId,
        ipAddress,
        osInfo: userAgent,
        refreshToken,
      }),
    );

    return { accessToken, refreshToken };
  }

  /**
   * Generates a session token with random id (uuid) and ip address as a payload
   * and saves the token to authentication session table in database. Returns the token
   */
  async createAuthSession(ipAddress: string): Promise<string> {
    const expireTime = await this.configFacade.get('AUTH_SESSION_EXPIRE_TIME');
    const sessionToken = this.jwtService.sign(
      {
        id: uuidv4(),
        ipAddress: ipAddress,
      },
      { expiresIn: expireTime },
    );

    await this.authSessionRepository.create({ token: sessionToken });
    return sessionToken;
  }

  /**
   * Checks whether the given token in state parameter has not expired yet,
   * if it is, deletes it from a database and throws an error. Then checks if
   * the given ip address matches that in the token, if it does not, deletes the
   * token from database and throws the error. If all the above did not throw an
   * error, tries to find the token in database. If it is not found, throws
   * the error, else just nothing happens and the flow continues
   * */
  async verifyAuthSession(state: string, ipAddress: string): Promise<void> {
    try {
      const token = await this.jwtService.verify(state);
      if (ipAddress !== token.ipAddress) {
        const token = await this.authSessionRepository.findOne({ where: { token: state } });
        if (token) {
          await token.destroy();
        }
        this.throwUnauthorizedException('AuthIdentityVerificationFailed');
      }
    } catch {
      const token = await this.authSessionRepository.findOne({ where: { token: state } });
      if (token) {
        await token.destroy();
      }
      this.throwUnauthorizedException('AuthIdentityVerificationFailed');
    }
    const token = await this.authSessionRepository.findOne({ where: { token: state } });
    if (token) {
      await token.destroy();
    } else {
      this.throwUnauthorizedException('AuthIdentityVerificationFailed');
    }
  }

  throwUnauthorizedException(error: string): never {
    this.logger.log(error);
    throw new NamedRpcException('UnauthorizedException', error);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteExpiredAuthSessions(): Promise<void> {
    const result = await this.authSessionRepository.findAll();

    for (const authSession of result) {
      try {
        await this.jwtService.verify(authSession.token);
      } catch {
        await authSession.destroy();
      }
    }

    // TODO: check if this needed.
    // this.authSessionRepository.findAll().then((result): void => {
    //   for (const authSession of result) {
    //     try {
    //       this.jwtService.verify(authSession.token);
    //     } catch {
    //       return authSession.destroy().then();
    //     }
    //   }
    // });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return lastValueFrom(
        this.userClient.send<User, UserFindDto>(UserManagementMessagePatternEnum.findUserByEmail, {
          email,
          withSessions: WithSessionsEnums.Active,
        }),
      );
    } catch {
      return null;
    }
  }

  async addAuthProvider(data: UserProviderCreateDto): Promise<UserProvider> {
    return lastValueFrom(
      this.userClient.send<UserProvider, UserProviderCreateDto>(UserManagementMessagePatternEnum.addProvider, data),
    );
  }

  async createUser(data: UserCreateDto): Promise<User> {
    return lastValueFrom(
      this.userClient.send<User, UserCreateDto>(UserManagementMessagePatternEnum.createNewUser, data),
    );
  }

  async updateProfile(data: UserProfileUpdateDto): Promise<UserProfile> {
    return lastValueFrom(
      this.userClient.send<UserProfile, UserProfileUpdateDto>(UserManagementMessagePatternEnum.updateUserProfile, data),
    );
  }

  async getActiveSessions(data: UserFindDto): Promise<UserSession[]> {
    return lastValueFrom(
      this.userClient.send<UserSession[], UserFindDto>(UserManagementMessagePatternEnum.findAllUserSessions, data),
    );
  }
}
