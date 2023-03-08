/* eslint-disable unicorn/no-static-only-class */
/* eslint-disable unicorn/import-style */
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

/**
 * PACKAGE_JSON string constant.
 */
export const PACKAGE_JSON = 'package.json';

/**
 * @class PackageJsonUtils provides package.json related helper functions.
 */
export class PackageJsonUtils {
  static packageJson: Record<string, unknown>;

  /**
   * getPackageJson Locates package.json file up from a given path.
   * Returns a parsed object representing package.json.
   *
   * @async
   * @function getPackageJson
   * @param {string} [startPath] - file system path to start the search from.
   * @returns {Promise<Record<string, unknown>>}
   */
  static async getPackageJson(startPath: string = process.cwd()): Promise<Record<string, unknown>> {
    if (PackageJsonUtils.packageJson) {
      return PackageJsonUtils.packageJson;
    }

    const fileWithPath = join(startPath, PACKAGE_JSON);
    try {
      const stat = await fs.lstat(startPath);
      if (stat.isDirectory()) {
        const children = await fs.readdir(startPath);
        const pJson = children.filter((child) => child === PACKAGE_JSON);
        if (!pJson || !pJson.length) {
          const parentDirectory = dirname(startPath);
          if (parentDirectory === startPath) {
            return {};
          }
          startPath = parentDirectory;
          return await PackageJsonUtils.getPackageJson(startPath);
        }
        const data = await fs.readFile(fileWithPath, 'utf8');
        PackageJsonUtils.packageJson = JSON.parse(data);
        return PackageJsonUtils.packageJson;
      }
      return {};
    } catch {
      return {};
    }
  }

  /**
   * getPackageName - returns name for package.json file.
   *
   * @async
   * @function getPackageName
   * @param {string} [startPath] - file system path to start the search from.
   * @returns {Promise<string | undefined>}
   */
  static async getPackageName(startPath: string = process.cwd()): Promise<string | undefined> {
    const packageJson = await this.getPackageJson(startPath);
    const packageName = packageJson.name;
    if (typeof packageName === 'string') {
      return packageName;
    }
    return undefined;
  }

  /**
   * getPackageVersion - returns version from package.json.
   *
   * @async
   * @function getPackageVersion
   * @param {string} [startPath] - file system path to start the search from.
   * @returns {Promise<Record<string, unknown>>}
   */
  static async getPackageVersion(startPath: string = process.cwd()): Promise<string | undefined> {
    const packageJson = await this.getPackageJson(startPath);
    const packageVersion = packageJson.version;
    if (typeof packageVersion === 'string') {
      return packageVersion;
    }
    return undefined;
  }
}
