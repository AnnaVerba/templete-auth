/**
 * @class ArrayUtils provides array helper functions.
 */
export const ArrayUtils = {
  /**
   * pickRandomFromArray - returns random element from given array or undefined if given array is empty.
   *
   * @function pickRandomFromArray
   * @param {Array} array
   * @returns {T|undefined} - item or undefined.
   */
  pickRandomFromArray<T>(array: Array<T>): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Checks array for emptiness
   *
   * @function
   * @param value array that should be checked for emptiness
   * @returns {Boolean}
   */
  isEmptyArray<T>(value: Array<T>): boolean {
    return value.length === 0;
  },
};
