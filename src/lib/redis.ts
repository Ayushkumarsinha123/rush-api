import { createClient } from 'redis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export const redis = createClient({
  url: env.REDIS_URL
});

redis.on('error', (err) => logger.error('Redis Client Error', err));
redis.on('connect', () => logger.info('Connected to Redis'));

// Connect to redis in your bootstrap() function in server.ts