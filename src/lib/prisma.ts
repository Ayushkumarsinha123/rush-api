import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg, { Connection } from 'pg'  
import { env } from "../config/env.js";

const { Pool } = pg;

// setup the postgresSQL conn pool

const pool = new Pool({ 
  connectionString : env.DATABASE_URL as string,
  max : 20,
  idleTimeoutMillis : 30000,
  connectionTimeoutMillis : 2000,
});
// initialize the apdapter
const adapter = new PrismaPg(pool);

// prevent multiple instances in development (hot reloading)

const globalForPrisma = global as unknown as {prisma : PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
