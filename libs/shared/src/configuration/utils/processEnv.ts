import { getEnvValueOrDefault } from './env';
/**
 * A wrapper class for accessing current process variables.
 */
class ProcessEnv {
  /** Returns IP of the hosted machine passed to the current process as env.HOST_IP variable */
  getMachineIP(): string {
    return getEnvValueOrDefault('CS_HOST_IP', '127.0.0.1');
  }

  /** Returns IP of the consul host ip config map if it not exist it will return getMachineIP variable */
  getConsulIP(): string {
    const consulIp = getEnvValueOrDefault('CS_CONSUL_HOST_IP', '');
    return consulIp || this.getMachineIP();
  }

  /** Returns IP address or host name passed to the current process as env.Host variable */
  getHost(): string {
    return process.env.HOST || '127.0.0.1';
  }

  /** Returns port number passed to the current process as env.CS_PORT variable */
  getPort(): string | number {
    return process.env.CS_PORT || 0;
  }
}

export const processEnv: ProcessEnv = new ProcessEnv();
