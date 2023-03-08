/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @class FsUtils provides files helper functions.
 */
export const FsUtils = {
  /**
   * getFileExtension - returns file extension: example.json -> json, example.env -> env, example -> undefined
   *
   * @function getFileExtension
   * @param {String} fileName - name of file.
   * @returns {String} - file extension.
   */
  getFileExtension(fileName: string): string | undefined {
    const res = /[^./]+$/.exec(fileName) || [''];
    // @ts-ignore
    if (res.index > 0 && res[0]) {
      return res[0].toLowerCase();
    }
    return undefined;
  },
};
