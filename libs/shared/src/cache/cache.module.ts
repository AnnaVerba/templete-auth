import { Module } from '@nestjs/common';
import NodeCacheService from './services/cache.node-cache.service';
import RedisService from './services/cache.redis.service';
import CacheService from './services/cache.service';

/**
 * @module CacheModule
 * Provides using several cache services in project.
 * Available types: Node-cache, Redis
 */
@Module({
  providers: [CacheService, NodeCacheService, RedisService],
  exports: [CacheService],
})
export class CacheModule {}
