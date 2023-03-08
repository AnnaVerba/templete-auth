/**
 * Configuration variables required for application. Retrieved from configuration
 * service
 */
export enum RequiredVariables {
  PORT = 'PORT',
  ACCESS_TOKEN_EXPIRE_TIME = 'ACCESS_TOKEN_EXPIRE_TIME',
  REFRESH_TOKEN_EXPIRE_TIME = 'REFRESH_TOKEN_EXPIRE_TIME',
  REFRESH_SECRET = 'REFRESH_SECRET',
  ACCESS_SECRET = 'ACCESS_SECRET',
  AUTH_MS_HOST = 'AUTH_MS_HOST',
  AUTH_MS_PORT = 'AUTH_MS_PORT',
  CORS_ORIGINS = 'CORS_ORIGINS',
  COOKIE_SECRET = 'COOKIE_SECRET',
}
