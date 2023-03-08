import ValueTypes from '@app/shared/cache/types/cache-value.types';

/**
 * @interface CacheServiceInterface
 * Determines types and return types in CacheService.
 */
export default interface CacheServiceInterface {
  /**
   * @method Set
   * Puts data in cache
   * @param  {string} key key for cache
   * @param  {ValueTypes} value cache value
   * @param  {number} ttl time to live in seconds. Default: 3600
   * @returns {Promise<boolean>} returns true for success, false for failure.
   */
  Set(key: string, value: ValueTypes, ttl?: number): Promise<boolean>;

  /**
   * @method Get
   * Gets data from cache
   * @param  {string} key key for cache
   * @returns {Promise<ValueTypes | null | undefined>} returns value or null|undefined for error
   */
  Get(key: string): Promise<ValueTypes | null | undefined>;

  /**
   * @method Take
   * Gets and remove data from cache
   * @param  {string} key key for cache
   * @returns {Promise<ValueTypes | null | undefined>} returns value or null|undefined for error
   */
  Take(key: string): Promise<ValueTypes | null | undefined>;

  /**
   * @method Del
   * Remove data from cache for key
   * @param  {string} key key for cache
   * @returns {Promise<boolean | number>} returns true for success, false for error
   */
  Del(key: string): Promise<boolean | number>;

  /**
   * @method Ttl
   * Sets variable's Time To Live in cache
   * @param  {string} key key for cache
   * @param  {number} ttl time to live in seconds
   * @returns {Promise<boolean>} returns true for success, false for error
   */
  Ttl(key: string, ttl: number): Promise<boolean>;

  /**
   * @method GetTtl
   * Gets variable's Time To Live in cache
   * @param  {string} key key for cache
   * @returns {Promise<number>} returns ttl
   */
  GetTtl(key: string): Promise<number>;

  /**
   * @method Keys
   * Gets all keys stored in cache
   * @returns {Promise<string[]>} returns array with all keys
   */
  Keys(): Promise<string[]>;

  /**
   * @method Has
   * Checking if cache has key
   * @param  {string} key key for cache
   * @returns {Promise<boolean>} returns true for success, false for error
   */
  Has(key: string): Promise<boolean>;

  /**
   * @method FlushAll
   * Flushes all data in cache
   * @returns {Promise<void>} nothing to return
   */
  FlushAll(): Promise<void>;

  /**
   * @method Close
   * Disconnects from cache service
   * @returns {Promise<void>} nothing to return
   */
  Close(): Promise<void>;
}
