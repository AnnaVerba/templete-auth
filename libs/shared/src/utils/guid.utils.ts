import * as uuid from 'uuid';

/**
 * GuidUtils provides uuid functionality.
 */
export const GuidUtils = {
  /**
   * newGuid - generates uuid
   *
   * @function newGuid
   * @param {Object} options - { alphaNumeric: true }
   * @returns {string}
   */
  newGuid(options?: { alphaNumeric: boolean }): string {
    const guid = uuid.v4();
    return options?.alphaNumeric ? guid.replace(/-/g, '') : guid;
  },
};
