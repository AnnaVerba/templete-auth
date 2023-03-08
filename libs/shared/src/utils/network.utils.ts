import { networkInterfaces } from 'os';
/**
 * @class NetworkUtils provides net helper functions.
 */
export const NetworkUtils = {
  /**
   *  getMachineIP - returns Machine IP from network interfaces.
   *  Note: Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses.
   *
   * @function getMachineIP
   * @returns {string|undefined} return the address or undefined.
   */
  getMachineIP(): string | undefined {
    const networkInterfaces = (): any[] => {
      return Object.values(networkInterfaces()).flat();
    };

    const ip = networkInterfaces().find((iFace) => iFace?.family === 'IPv4' && !iFace?.internal);
    return ip?.address;
  },
};
