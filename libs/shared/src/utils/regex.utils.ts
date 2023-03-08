/**
 * RegexUtils provides frequently used Regex.
 */
export const RegexUtils = {
  /**
   * detectSpacesRegex is a regular expression which is used to find white spaces in a string.
   */
  detectSpacesRegex: new RegExp(/\s/, 'g'),

  /**
   * detectBothSidesSlashesRegex is a regular expression which is used to detect slashes on both ends of the string.
   */
  detectBothSidesSlashesRegex: new RegExp(/^\/+|\/+$/, 'g'),

  /**
   * detectCSVar var that has CS_ prefix, like CS_ENVIRONMENT (case insensitive)
   */
  detectCSVar: new RegExp(/^cs_/i),
};
