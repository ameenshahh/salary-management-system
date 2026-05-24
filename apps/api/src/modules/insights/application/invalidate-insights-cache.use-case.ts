import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { INSIGHTS_CACHE_PREFIX } from '../../../common/cache/cache-keys';

@Injectable()
export class InvalidateInsightsCacheUseCase {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async execute(): Promise<void> {
    const store = this.cache.store as { keys?: (pattern: string) => Promise<string[]> };
    if (store.keys) {
      const keys = await store.keys(`${INSIGHTS_CACHE_PREFIX}*`);
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
  }
}
