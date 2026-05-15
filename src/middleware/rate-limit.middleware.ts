import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../lib/redis.js';

// global limiter : prevent general spam 
export const globalLimiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 min
  limit : 100,
  standardHeaders : true,
  legacyHeaders : false,
  store : new RedisStore({
    sendCommand : (...args: string[]) => redis.sendCommand(args),
  })
})

// booking limiter : much stricter for the sensitive order endpoint\
export const bookingLimiter = rateLimit({
  windowMs : 1 * 60 * 1000, //1 min
  limit : 5, // only 5 booking attempts per min
  message : { error : "Too many booking attemps. pls try again in a min"},
  store : new RedisStore ({ 
    sendCommand : (...args: string[]) => redis.sendCommand(args),
  }),
})