/**
 * @class DateUtils provides Date helper functions.
 */
export const DateUtils = {
  /* dateNow - Initializes and returns a new date with the current time.
   *
   * @function now
   * @returns Date - new Date object.
   */
  dateNow(): Date {
    return new Date();
  },

  /**
   * dateParse - Initializes and returns a new date with the given date string.
   *
   * @function parse
   * @param {string} dateString - The string in date format - according to the documentation here :
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse.
   * @returns Date - new Date object with given date and time.
   */
  dateParse(dateString: string): Date {
    return new Date(Date.parse(dateString));
  },
};
