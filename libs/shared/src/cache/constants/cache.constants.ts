/**
 * NODE_CACHE_NAME - global constant for NodeCacheService dependency injection.
 */
export const NODE_CACHE_NAME = 'node-cache';
/**
 * REDIS_CACHE_NAME - global constant for RedisCacheService dependency injection.
 */
export const REDIS_CACHE_NAME = 'redis';
/**
 * CACHE_PROVIDERS_TYPES - global constant for available types.
 */
export const CACHE_PROVIDERS_TYPES = [NODE_CACHE_NAME, REDIS_CACHE_NAME];
/**
 * DEFAULT_CACHE_TTL - default ttl value, 60 min.
 */
export const DEFAULT_TTL = 60 * 60;
