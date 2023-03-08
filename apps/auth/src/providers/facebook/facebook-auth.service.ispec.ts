import { Test } from '@nestjs/testing';
import { FacebookAuthService } from './facebook-auth.service';
import { ConfigModule, ENV } from '@app/shared';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { FacebookServiceOptions } from './types';

// eslint-disable-next-line unicorn/prefer-node-protocol
import { env } from 'process';

describe('FacebookAuthService', () => {
  let facebookAuthService: FacebookAuthService;

  beforeAll(async () => {
    env.FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
    env.FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: FacebookAuthService,
          useFactory: async (configFacade: ConfigFacade) => {
            const options: FacebookServiceOptions = {
              appId: await configFacade.get('FACEBOOK_APP_ID'),
              appSecret: await configFacade.get('FACEBOOK_APP_SECRET'),
              callbackURL: await configFacade.get('FACEBOOK_AUTH_REDIRECT_URL'),
            };
            return new FacebookAuthService(options);
          },
          inject: [ConfigFacade],
        },
      ],
      imports: [
        ConfigModule.forRoot(ENV, {
          FACEBOOK_APP_ID: 'FACEBOOK_APP_ID',
          FACEBOOK_APP_SECRET: 'FACEBOOK_APP_SECRET',
        }),
      ],
    }).compile();

    facebookAuthService = moduleRef.get<FacebookAuthService>(FacebookAuthService);
  });

  describe('.getFacebookAuthUrl', () => {
    it.each(['someState', 'h3j4b598'])('should return url of facebook login form', (input) => {
      const result = new RegExp(`^https:\/\/www.facebook.com.*state=${input}.*$`);
      expect(facebookAuthService.getFacebookAuthURL(input)).toMatch(result);
    });

    it.each(['', undefined, null, false])('should throw an error', (input: any) => {
      expect(facebookAuthService.getFacebookUser(input)).rejects.toThrow();
    });
  });

  describe('.getFacebookUser', () => {
    it.each(['', undefined, null, 'jh34545b'])('should throw an error', (input) => {
      expect(facebookAuthService.getFacebookUser(input)).rejects.toThrow();
    });
  });
});
