import { FsUtils } from './fs.utils';

/**
 * FsUtils tests.
 */
describe('FsUtils testing', () => {
  it('should return json', () => {
    expect(FsUtils.getFileExtension('example.json')).toEqual('json');
  });

  it('should return yaml', () => {
    expect(FsUtils.getFileExtension('example.yaml')).toEqual('yaml');
  });

  it('should return yml', () => {
    expect(FsUtils.getFileExtension('example.yml')).toEqual('yml');
  });

  it('should return env', () => {
    expect(FsUtils.getFileExtension('example.env')).toEqual('env');
  });

  it('should return env', () => {
    expect(FsUtils.getFileExtension('example.dev.env')).toEqual('env');
  });

  it('should return env', () => {
    expect(FsUtils.getFileExtension('.env')).toEqual('env');
  });

  it('should return undefined', () => {
    expect(FsUtils.getFileExtension('example')).toEqual(undefined);
  });

  it('should return undefined', () => {
    expect(FsUtils.getFileExtension('example.')).toEqual(undefined);
  });

  it('should return undefined', () => {
    expect(FsUtils.getFileExtension('.example.')).toEqual(undefined);
  });
});
