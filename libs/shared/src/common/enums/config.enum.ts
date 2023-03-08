export enum RequiredEnvVariablesEnum {
  DATABASE_URL = 'DATABASE_URL',
  ACCESS_TOKEN_EXPIRE_TIME = 'ACCESS_TOKEN_EXPIRE_TIME',
  REFRESH_TOKEN_EXPIRE_TIME = 'REFRESH_TOKEN_EXPIRE_TIME',
  REFRESH_SECRET = 'REFRESH_SECRET',
  ACCESS_SECRET = 'ACCESS_SECRET',
  EMAIL_ID = 'EMAIL_ID',
  EMAIL_PASS = 'EMAIL_PASS',
  PORT = 'PORT',
  DELIVERY_MS_HOST = 'DELIVERY_MS_HOST',
  DELIVERY_MS_PORT = 'DELIVERY_MS_PORT',
  AUTH_MS_HOST = 'AUTH_MS_HOST',
  AUTH_MS_PORT = 'AUTH_MS_PORT',
  CORS_ORIGINS = 'CORS_ORIGINS',
  COOKIE_SECRET = 'COOKIE_SECRET',
  GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET',
  FACEBOOK_APP_ID = 'FACEBOOK_APP_ID',
  FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET',
  AUTH_SESSION_EXPIRE_TIME = 'AUTH_SESSION_EXPIRE_TIME',
}

export enum MicroServicesEnum {
  DELIVERY_MS = 'DELIVERY_MS',
  AUTH_MS = 'AUTH_MS',
  USERMANAGEMENT_MS = 'USERMANAGEMENT_MS',
}
