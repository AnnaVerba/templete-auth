import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthSessionRepository, BcryptService, ConfigModule, ENV, JwtService, MicroServicesEnum } from '@app/shared';

import { GoogleAuthService } from '../providers/google/google-auth.service';
import { FacebookAuthService } from '../providers/facebook/facebook-auth.service';
import { Observable } from 'rxjs';
import { env } from 'process';

describe('AuthService', () => {
  let authService: AuthService;
  let authSessionRepository: AuthSessionRepository;
  let googleAuthService: GoogleAuthService;
  let facebookAuthService: FacebookAuthService;
  let jwtService: JwtService;
  let bcryptService;
  let deliveryClientProxy;
  let userClient;
  let user;
  beforeEach(async () => {
    env.FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
    env.FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
    env.GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_SECRET';
    env.GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        BcryptService,
        GoogleAuthService,
        FacebookAuthService,
        AuthSessionRepository,
        {
          provide: MicroServicesEnum.DELIVERY_MS,
          useValue: {
            send: jest.fn(
              () =>
                new Observable((s) => {
                  s.next(true);
                  s.complete();
                }),
            ),
          },
        },
        {
          provide: MicroServicesEnum.USERMANAGEMENT_MS,
          useValue: {
            send: jest.fn(
              () =>
                new Observable((s) => {
                  s.next(false);
                  s.complete();
                }),
            ),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(ENV, {
          FACEBOOK_APP_ID: 'FACEBOOK_APP_ID',
          FACEBOOK_APP_SECRET: 'FACEBOOK_APP_SECRET',
          GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_SECRET',
          GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
        }),
      ],
    })
      .overrideProvider(GoogleAuthService)
      .useValue({
        getGoogleAuthURL: jest.fn().mockReturnValue('https://...'),
        getGoogleUser: jest.fn().mockReturnValue({ id: 123_456, name: 'Bob', email: 'bob@mail.com' }),
      })
      .overrideProvider(FacebookAuthService)
      .useValue({
        getFacebookAuthURL: jest.fn().mockReturnValue('https://...'),
        getFacebookUser: jest.fn().mockReturnValue({ id: 123_456, name: 'Emily', email: 'emily@mail.com' }),
      })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(),
        verify: jest.fn().mockImplementation((state) => {
          return {
            state,
            ipAddress: '0.0.0.0',
            email: 'bob@mail.com',
          };
        }),
        signToken: jest.fn(),
        verifyToken: jest.fn().mockReturnValue({ email: 'some' }),
        generateTokens: jest.fn().mockReturnValue({ accessToken: 'some', refreshToken: 'some' }),
      })
      .overrideProvider(AuthSessionRepository)
      .useValue({
        create: jest.fn().mockReturnValue({ destroy: jest.fn() }),
        findOne: jest.fn().mockReturnValue({ destroy: jest.fn() }),
        findAll: jest.fn().mockReturnValue({ destroy: jest.fn() }),
      })
      .compile();
    user = { id: 123_456, name: 'Bob', email: 'bob@mail.com', password: '123456' };
    authService = module.get<AuthService>(AuthService);
    authSessionRepository = module.get<AuthSessionRepository>(AuthSessionRepository);
    googleAuthService = module.get<GoogleAuthService>(GoogleAuthService);
    facebookAuthService = module.get<FacebookAuthService>(FacebookAuthService);
    jwtService = module.get<JwtService>(JwtService);
    bcryptService = module.get<BcryptService>(BcryptService);
    deliveryClientProxy = module.get(MicroServicesEnum.DELIVERY_MS);
    userClient = module.get(MicroServicesEnum.USERMANAGEMENT_MS);

    authService.createUser = jest.fn().mockReturnValue(user);
    authService.addAuthProvider = jest.fn();
    authService.updateProfile = jest.fn();
    authService.getActiveSessions = jest.fn().mockReturnValue([{ id: '1', isActive: true }, { id: '2' }]);
    authService.findUserByEmail = jest.fn();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('verifyEmail', async () => {
    const input = { email: 'bob@mail.com', origin: 'localhost:3000' };
    const jwtSpy = jest.spyOn(jwtService, 'signToken');

    await authService.verifyEmail(input);
    expect(jwtSpy).toHaveBeenCalled();
  });
  //
  it.each([
    {
      ipAddress: '0.0.0.0',
      userAgent: 'MyAgent',
      email: 'john@mail.com',
      phone: null,
      verifyToken: 'hj32bh42...',
      password: '123456',
      firstName: 'Bob',
      lastName: 'Test',
    },
  ])('signUp', async (input) => {
    const jwtSpy = jest.spyOn(jwtService, 'verifyToken');
    const result = await authService.signUp(input);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');

    expect(jwtSpy).toHaveBeenCalled();
  });

  describe('signIn', () => {
    it.each([{ email: 'john@mail.com', password: '123456', ipAddress: '0.0.0.0', userAgent: 'MyAgent' }])(
      'should pass if password was specified',
      async (input) => {
        user.password = await bcryptService.hash(user.password);
        jest.spyOn(authService, 'findUserByEmail').mockReturnValueOnce(user);

        const result = await authService.signIn(input);
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
      },
    );

    it.each([{ email: 'john@mail.com', password: null, ipAddress: '0.0.0.0', userAgent: 'MyAgent' }])(
      'should not pass if password was not specified',
      async (input) => {
        user.password = null;
        authService.findUserByEmail = jest.fn().mockReturnValue(user);

        await expect(() => authService.signIn(input)).rejects.toThrow();
      },
    );
  });
  //
  it.each([{ email: 'john@mail.com', origin: 'someorigin' }])('signInWithEmail', async (input) => {
    authService.findUserByEmail = jest.fn().mockReturnValue(user);
    const deliverySpy = jest.spyOn(deliveryClientProxy, 'send');

    expect(() => authService.signInWithEmail(input)).not.toThrow();
    expect(deliverySpy).toHaveBeenCalled();
  });

  describe('forgotPassword', () => {
    it.each([{ email: 'john@mail.com', origin: 'someorigin' }])('should pass ', async (input) => {
      authService.findUserByEmail = jest.fn().mockReturnValue(user);

      expect(() => authService.forgotPassword(input)).not.toThrow();
    });

    it.each([{ email: 'john@mail.com', origin: 'someorigin' }])(
      'user with provided email doesnt exist',
      async (input) => {
        const deliverySpy = jest.spyOn(deliveryClientProxy, 'send').mockClear();
        jest.spyOn(authService, 'findUserByEmail').mockClear();
        await expect(() => authService.forgotPassword(input)).rejects.toThrow();
        expect(deliverySpy).not.toHaveBeenCalled();
      },
    );
  });

  it.each([
    { recoveryToken: { email: 'bob@mail.com' }, password: '123456', ipAddress: '0.0.0.0', userAgent: 'MyAgent' },
  ])('recoveryPassword', async (input) => {
    authService.findUserByEmail = jest.fn().mockReturnValue(user);
    const jwtSpy = jest.spyOn(jwtService, 'verify');
    jest.spyOn(userClient, 'send');
    expect(
      await authService.recoveryPassword(
        input.recoveryToken as any as string,
        input.password,
        input.ipAddress,
        input.userAgent,
      ),
    ).toHaveProperty('accessToken');
    expect(userClient.send).toHaveBeenCalled();
    expect(jwtSpy).toHaveBeenCalled();
  });
  //
  it.each([{ loginToken: { email: 'bob@mail.com' }, ipAddress: '0.0.0.0', userAgent: 'MyAgent' }])(
    'verifyLoginToken',
    async (input) => {
      const jwtSpy = jest.spyOn(jwtService, 'verify');
      user.sessions = [{ id: '1', isActive: true }, { id: '2' }];
      authService.findUserByEmail = jest.fn().mockReturnValue(user);
      expect(
        await authService.verifyLoginToken({
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          loginToken: input.loginToken as any as string,
        }),
      );
      expect(jwtSpy).toHaveBeenCalled();
    },
  );
  //
  it.each([{ sessionId: 'nk34j45029...', userId: '12_34' }])('refresh', async (input) => {
    const userClientSpy = jest.spyOn(userClient, 'send');

    expect(await authService.refresh(input));
    expect(userClientSpy).toHaveBeenCalled();
  });
  //
  it.each([{ sessionId: 'nk34j45029...' }])('logout', async (input) => {
    userClient.send = jest.fn(
      () =>
        new Observable((s) => {
          s.next(1);
          s.complete();
        }),
    );
    const userClientSpy = jest.spyOn(userClient, 'send');
    expect(await authService.logout(input));
    expect(userClientSpy).toHaveBeenCalled();
  });

  describe('Google Auth', () => {
    it.each([{ ipAddress: '212.173.3.98' }])('getGoogleAuthUrl', async (input) => {
      const googleSpy = jest.spyOn(googleAuthService, 'getGoogleAuthURL');
      const authSessionSpy = jest.spyOn(authService, 'createAuthSession');

      expect(await authService.getGoogleAuthUrl(input)).toHaveProperty('consentUrl');
      expect(googleSpy).toHaveBeenCalled();
      expect(authSessionSpy).toHaveBeenCalled();
    });

    it.each([{ code: 'someCode', state: 'someState', ipAddress: '0.0.0.0', userAgent: 'MyAgent' }])(
      'loginWithGoogle',
      async (input) => {
        const googleSpy = jest.spyOn(googleAuthService, 'getGoogleUser').mockReturnValue(user);
        const verifyAuthSessionSpy = jest.spyOn(authService, 'verifyAuthSession');
        userClient.send = jest.fn(
          () =>
            new Observable((s) => {
              s.next(null);
              s.complete();
            }),
        );
        authService.findUserByEmail = jest.fn().mockReturnValue(user);
        const result = await authService.loginWithGoogle(input);
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
        expect(googleSpy).toHaveBeenCalled();
        expect(verifyAuthSessionSpy).toHaveBeenCalled();
      },
    );
  });
  //
  describe('Facebook Auth', () => {
    it.each([{ ipAddress: '0.0.0.0' }])('getFacebookAuthUrl', async (input) => {
      const facebookSpy = jest.spyOn(facebookAuthService, 'getFacebookAuthURL');
      const authSessionSpy = jest.spyOn(authService, 'createAuthSession');

      expect(await authService.getFacebookAuthUrl(input.ipAddress)).toHaveProperty('consentUrl');
      expect(facebookSpy).toHaveBeenCalled();
      expect(authSessionSpy).toHaveBeenCalled();
    });

    it.each([{ code: 'someCode', state: 'someState', ipAddress: '0.0.0.0', userAgent: 'MyAgent' }])(
      'loginWithFacebook',
      async (input) => {
        const facebookSpy = jest.spyOn(facebookAuthService, 'getFacebookUser');
        const verifyAuthSessionSpy = jest.spyOn(authService, 'verifyAuthSession');
        userClient.send = jest.fn(
          () =>
            new Observable((s) => {
              s.next(null);
              s.complete();
            }),
        );
        authService.findUserByEmail = jest.fn().mockReturnValue(user);
        const result = await authService.loginWithFacebook(input);
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
        expect(facebookSpy).toHaveBeenCalled();
        expect(verifyAuthSessionSpy).toHaveBeenCalled();
      },
    );
  });

  it.each([{ ipAddress: '212.173.3.98' }])('createAuthSession', async (input) => {
    const jwtSpy = jest.spyOn(jwtService, 'sign');
    const authSessionSpy = jest.spyOn(authSessionRepository, 'create');

    await authService.createAuthSession(input.ipAddress);
    expect(jwtSpy).toHaveBeenCalled();
    expect(authSessionSpy).toHaveBeenCalled();
  });

  it.each([{ state: 'someState', ipAddress: '212.173.3.98' }])('verifyAuthSession', async (input) => {
    const jwtSpy = jest.spyOn(jwtService, 'verify');
    const authSessionSpy = jest.spyOn(authSessionRepository, 'findOne');

    await expect(authService.verifyAuthSession(input.state, input.ipAddress)).rejects.toThrow();
    expect(jwtSpy).toHaveBeenCalled();
    expect(authSessionSpy).toHaveBeenCalled();
  });
});
