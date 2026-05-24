import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
        if (process.env.NODE_ENV === 'test') {
          return { ttl: 300000 };
        }
        return {
          store: await redisStore({ url: redisUrl }),
          ttl: 300000,
        };
      },
    }),
  ],
})
export class CacheConfigModule {}
