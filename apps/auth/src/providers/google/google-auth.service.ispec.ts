import { Test } from '@nestjs/testing';
import { GoogleAuthService } from './google-auth.service';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { GoogleServiceOptions } from './types';
import { ConfigModule, ENV } from '@app/shared';
import { env } from 'process';

describe('GoogleAuthService', () => {
  let googleAuthService: GoogleAuthService;

  beforeAll(async () => {
    env.GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_SECRET';
    env.GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: GoogleAuthService,
          useFactory: async (configFacade: ConfigFacade) => {
            const options: GoogleServiceOptions = [
              await configFacade.get('GOOGLE_CLIENT_ID'),
              await configFacade.get('GOOGLE_CLIENT_SECRET'),
              await configFacade.get('GOOGLE_AUTH_REDIRECT_URL'),
            ];
            return new GoogleAuthService(options);
          },
          inject: [ConfigFacade],
        },
      ],
      imports: [
        ConfigModule.forRoot(ENV, {
          GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_SECRET',
          GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
        }),
      ],
    }).compile();
    googleAuthService = moduleRef.get<GoogleAuthService>(GoogleAuthService);
  });

  describe('.getGoogleAuthURL', () => {
    it.each(['someState', 'h3j4b598'])('should return url of google login form', (input) => {
      const result = new RegExp(`^https:\/\/accounts.*state=${input}.*redirect$`);

      expect(googleAuthService.getGoogleAuthURL(input)).toMatch(result);
    });

    it.each(['', undefined, null, false])('should throw an error', (input: any) => {
      expect(() => googleAuthService.getGoogleAuthURL(input)).toThrow();
    });
  });

  describe('.getGoogleUser', () => {
    it.each(['', undefined, null, 'jh34545b'])('should throw an error', (input) => {
      expect(googleAuthService.getGoogleUser(input)).rejects.toThrow();
    });
  });
});
