import { GuidUtils } from './guid.utils';

/**
 * GuidUtils tests.
 */
describe('GuidUtils tests', () => {
  it('should generate guid string with 32 alphanumeric characters.', () => {
    const actual = GuidUtils.newGuid({ alphaNumeric: true });

    expect(typeof actual).toEqual('string');
    expect(/^[\da-z]{32}$/.test(actual)).toEqual(true);
  });

  it('should generate guid string with 32 alphanumeric characters and 4 dashes.', () => {
    const actual = GuidUtils.newGuid();

    expect(typeof actual).toEqual('string');
    expect(/^[\d\\a-z-]{36}$/.test(actual)).toEqual(true);
  });

  it('should generate unique guids.', () => {
    const actual = [...Array.from({ length: 10 }).keys()].map(() => GuidUtils.newGuid({ alphaNumeric: true }));

    const distinctGuids = [...new Set(actual)];
    expect(actual.length).toEqual(distinctGuids.length);
  });
});
