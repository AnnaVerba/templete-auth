import { oauth2_v2 } from 'googleapis';

export interface GoogleProfileInfo extends oauth2_v2.Schema$Userinfo {
  name: string;
  email: string;
  given_name: string;
  family_name: string;
}

export interface FacebookProfileInfo {
  id: string;
  name: string;
  email?: string;
  first_name: string;
  last_name: string;
}
