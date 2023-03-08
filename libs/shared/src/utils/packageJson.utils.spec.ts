import { PackageJsonUtils } from './packageJson.utils';

/**
 * PackageJsonUtils testing.
 */
describe('PackageJsonUtils testing', () => {
  it('should return an object', async () => {
    expect(PackageJsonUtils.packageJson).toBeUndefined();

    const result = await PackageJsonUtils.getPackageJson();

    expect(PackageJsonUtils.packageJson).toBeInstanceOf(Object);
    expect(result).toBeInstanceOf(Object);
  });

  it('should return package.json with data', async () => {
    const result = await PackageJsonUtils.getPackageJson();

    expect(result.name).toBeDefined();
    expect(result.version).toBeDefined();
    expect(result.dependencies).toBeDefined();
    expect(result.dependencies).toBeInstanceOf(Object);
    expect(result.devDependencies).toBeDefined();
    expect(result.devDependencies).toBeInstanceOf(Object);
  });

  it('should return an object', async () => {
    const result = await PackageJsonUtils.getPackageJson();
    expect(result).toBeInstanceOf(Object);
  });

  it('should return package.json with data', async () => {
    const result = await PackageJsonUtils.getPackageJson();

    expect(result.name).toBeDefined();
    expect(result.version).toBeDefined();
    expect(result.dependencies).toBeDefined();
    expect(result.dependencies).toBeInstanceOf(Object);
    expect(result.devDependencies).toBeDefined();
    expect(result.devDependencies).toBeInstanceOf(Object);
  });

  it('should return undefined, due to incorrect path', async () => {
    PackageJsonUtils.packageJson = undefined;
    const packageJsonName = await PackageJsonUtils.getPackageName(`${process.cwd()}/path`);
    expect(packageJsonName).toBeUndefined();
  });

  it('should return a string', async () => {
    const packageJsonVersion = await PackageJsonUtils.getPackageVersion();
    expect(typeof packageJsonVersion).toBe('string');
  });

  it('should return undefined due to incorrect path', async () => {
    PackageJsonUtils.packageJson = undefined;
    const packageJsonVersion = await PackageJsonUtils.getPackageVersion(`${process.cwd()}/path`);
    expect(packageJsonVersion).toBeUndefined();
  });
});
