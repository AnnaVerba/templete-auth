import { addEnvVarFromFile, getEnvVarByKey } from '@app/shared/configuration/utils/env';

describe('environmentVariablesRepository integration tests', () => {
  test('getEnvVarByKey() -> process.env  is empty object -> undefined returned', async () => {
    // arrange
    process.env = {};

    // act
    const actual = getEnvVarByKey('cs_key3');

    // assert
    expect(actual).toBeUndefined();
  });

  test('getEnvVarByKey() -> process.env contains non-matching keys -> undefined returned', async () => {
    // arrange
    process.env = { cs_key1: 'value1', cs_key2: 'value2' };

    // act
    const actual = getEnvVarByKey('cs_key3');

    // act
    expect(actual).toBeUndefined();
  });

  test('getEnvVarByKey() -> process.env contains key value of requested key returned', async () => {
    // arrange
    process.env = { cs_key1: 'value1', cs_key2: 'value2' };

    // act
    const actual = getEnvVarByKey('cs_key2');

    // act
    expect(actual).toEqual('value2');
  });

  test('addEnvVarFromFile dotenv file exists environment variable added to porcess env', () => {
    const originalKeys = Object.keys(process.env).length;
    addEnvVarFromFile('///src/env');
    const transformKeys = Object.keys(process.env).length;
    expect(transformKeys).toBeGreaterThan(originalKeys);
  });

  test('addEnvVarFromFile dotenv file not exists environment variable added to porcess env', () => {
    const originalKeys = Object.keys(process.env).length;
    addEnvVarFromFile('/src/env/.env1');
    const transformKeys = Object.keys(process.env).length;
    expect(transformKeys).toEqual(originalKeys);
  });
});
