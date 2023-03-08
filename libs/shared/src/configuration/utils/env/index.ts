import dotenv from 'dotenv';

type IKeyValue = {
  [key: string]: string;
};

const getFilePath = (dotenvFilePath: string): string => {
  let path = dotenvFilePath.replace(/^\/+|\/+$/g, '');
  if (!path.endsWith('.env')) {
    path = `${path}/.env`;
  }
  return `${process.cwd()}/${path}`;
};

/**
 * get process.env.cs* variable by name
 * @param {String} variableName - environment variable name, for example: 'CS_SERVICE_NAME'.
 */
export const getEnvVarByKey = (key: string): string => {
  if (key.toLowerCase().startsWith('cs')) {
    return process.env[key];
  }
  return undefined;
};

/**
 * addEnvVarFromFile add dotenv file variable to process.env to environment variables data.
 * @param {String} dotenvFilePath the relative path to the .env file
 */
export const addEnvVarFromFile = (dotenvFilePath = '.env'): dotenv.DotenvConfigOutput | void => {
  try {
    dotenv.config({ path: getFilePath(dotenvFilePath) });
  } catch {
    // we don`t do anything with the exception cause
    // in production (k8s) we would not have .env file
  }
};

/**
 * get environment variables data.
 */
export const getAllEnvVars = (): IKeyValue => {
  const environmentVariables: IKeyValue = {};
  for (const variableName of Object.keys(process.env)) {
    // if (variableName.toLowerCase().startsWith('cs')) {
    environmentVariables[variableName] = process.env[variableName];
    // }
  }
  return environmentVariables;
};

/**
 * get Environment value.
 * @param {String} variableName the env.process value
 * @param {String} defaultValue default value
 * @returns process.env.* or default value
 */
export const getEnvValueOrDefault = (key: string, defaultValue: string): string => getEnvVarByKey(key) || defaultValue;
