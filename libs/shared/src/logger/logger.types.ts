/**
 * LogLevels is enum that defines possible log levels.
 */
export enum LogLevels {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

/**
 * @enum LogFormat - logging formats that are currently in use (json or human_readable).
 */
export enum LogFormat {
  /** humanReadable - each line is considered as separate log entry */
  humanReadable = 'human_readable',
  /** json - log entry is a json object */
  json = 'json',
}

/**
 * LoggerOptions is class that provides payload for
 * logger configuration. At the moment it contains only
 * log level initialization, but it could be extended in
 * future.
 */
export class LoggerOptions {
  level: LogLevels;

  constructor(public l?: LogLevels) {
    this.level = l ?? LogLevels.warn;
  }
}
