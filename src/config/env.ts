import { z } from "zod"
import dotenv from 'dotenv'

dotenv.config() // we load environment variables from .env file

//now we have to define schema for env variables

const envSchema = z.object({
   NODE_ENV : z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string()
    .default('3000') 
    .transform((val) => parseInt(val, 10)),
    //database url
    DATABASE_URL: z.string().url(),
    // redis url
    JWT_SECRET: z.string().min(10),
});

// parse and validate the env var
const _env = envSchema.safeParse(process.env);

if(!_env.success) {
  console.error('invalid env variables :', _env.error.format())
  process.exit(1);  // stop the aplication from starting
}


export const env = _env.data;