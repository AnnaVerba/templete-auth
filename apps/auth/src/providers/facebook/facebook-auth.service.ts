import { URLSearchParams } from 'url';

import { Injectable } from '@nestjs/common';
import { FacebookProfileInfo } from '@app/shared';
import axios from 'axios';
import { FacebookServiceOptions } from './types';

/**
 * Provides an abstraction over Facebook OAuth API. Allows using facebook as
 * an identity provider
 */
@Injectable()
export class FacebookAuthService {
  private scopes: string[];
  private config: FacebookServiceOptions;

  // facebook api version
  public apiVersion = 'v15.0';

  // list of profile fields which to ask from facebook, depend on permissions
  public profileFields = ['id', 'email', 'name', 'first_name', 'last_name'];

  constructor(options: FacebookServiceOptions) {
    this.scopes = ['email', 'public_profile'];
    this.config = options;
  }

  /**
   * Generates an url for facebook user consent form, where user can log in into
   * their Facebook account.
   */
  public getFacebookAuthURL(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.callbackURL,
      scope: this.scopes.join(','),
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
      state: state,
    });

    return `https://www.facebook.com/${this.apiVersion}/dialog/oauth?${params}`;
  }

  /**
   * Makes an GET request to facebook api to get access token by the given 'code'
   */
  private async getAccessToken(code: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.callbackURL,
      client_secret: this.config.appSecret,
      code: code,
    });
    const url = `https://graph.facebook.com/${this.apiVersion}/oauth/access_token?${params}`;

    const { data } = await axios.get(url);
    return data.access_token;
  }

  /**
   * Fetches the user's profile data by the given access token making GET request
   * to facebook api
   */
  private async getFacebookUserData(accessToken: string): Promise<FacebookProfileInfo> {
    const params = new URLSearchParams({
      fields: this.profileFields.join(','),
      access_token: accessToken,
    });
    const url = `https://graph.facebook.com/${this.apiVersion}/me?${params}`;

    const { data } = await axios.get(url);
    return data;
  }

  /**
   * Fetches user's profile by the given code from facebook consent screen
   */
  public async getFacebookUser(code: string): Promise<FacebookProfileInfo> {
    if (!code) {
      throw new Error('Code must be specified');
    }
    const accessToken = await this.getAccessToken(code);
    return this.getFacebookUserData(accessToken);
  }
}
