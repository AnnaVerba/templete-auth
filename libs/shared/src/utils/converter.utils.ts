/**
 * @class ConverterUtils provides converter helper functions.
 */
export const ConverterUtils = {
  /**
   * @function toBoolean
   * returns true or false for Boolean type.
   * returns true for string "true" (case insensitive).
   * returns false for anything else.
   *
   * @param {unknown} value - param of unknown type.
   * @returns {Boolean}
   */
  toBoolean: (value: unknown): boolean => {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase().trim() === 'true';
    }
    return false;
  },

  /**
   * @function toKebabCase - converts string to kebab-case, example: dataDog -> data-dog
   *
   * @param {string} value - param of string type.
   * @returns {string}
   */
  toKebabCase: (value: string): string => {
    const A = 65,
      Z = 90;
    const strArr = [...value.replace(/_/g, '-')];
    // eslint-disable-next-line unicorn/no-array-reduce
    const kebabStr = strArr.reduce((acc, curr) => {
      if (curr.codePointAt(0) >= A && curr.codePointAt(0) <= Z) {
        curr = curr.toLowerCase();
        if (acc.length === 0) {
          acc = curr;
        } else {
          acc = acc.endsWith('-') ? `${acc}${curr}` : `${acc}-${curr}`;
        }
      } else {
        acc = `${acc}${curr}`;
      }
      return acc;
    }, '');
    return kebabStr;
  },
};
