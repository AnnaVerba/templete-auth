import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GoogleProfileInfo } from '@app/shared';
import { GoogleServiceOptions } from './types';

/**
 * Provides an abstraction over Google OAuth API. Allows using google as
 * an identity provider
 */
@Injectable()
export class GoogleAuthService {
  private readonly oauth2Client: OAuth2Client;
  private readonly scopes: string[];

  // currently only 'v2' is supported
  /* eslint-disable  @typescript-eslint/prefer-as-const */
  public apiVersion: 'v2' = 'v2';

  constructor(options: GoogleServiceOptions) {
    this.oauth2Client = new google.auth.OAuth2(...options);

    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
  }

  /**
   * Generates an url for Google user consent form, where user can log in into
   * their Google account.
   */
  getGoogleAuthURL(state: string): string {
    if (!state) {
      throw new Error('State must be specified');
    }
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.scopes,
      state: state,
    });
  }

  /**
   * Fetches user's profile using provided oauth credentials from the oauth client
   */
  private async fetchGoogleProfile(): Promise<GoogleProfileInfo> {
    return new Promise((resolve, reject) => {
      const oauth2 = google.oauth2({ auth: this.oauth2Client, version: this.apiVersion });
      oauth2.userinfo.get((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.data as GoogleProfileInfo);
        }
      });
    });
  }

  /**
   * Exchanges a given 'code' with auth tokens, provided by google, and uses
   * an access token to fetch user's Google profile
   */
  async getGoogleUser(code: string): Promise<GoogleProfileInfo> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials({ access_token: tokens.access_token });
    return this.fetchGoogleProfile();
  }
}
