// This file pulls everything together. It imports the validated config, connects to the database, and starts listening.
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import {logger } from "./lib/logger.js";
import app from './app.js'

async function bootstrap() {
  try {
    // connect to the database
    await prisma.$connect();
    logger.info("connected to database");

    //start the server 
    const server = app.listen(env.PORT , () => {
     logger.info(`server is running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`)
    })

    // shutdown 
    const shutdown = async () => {
      logger.info('SIGINT/SIGTERM received. Shutting down..');
      server.close(async () => {
        await prisma.$disconnect() ;
        logger.info('Server and db connection closed.');
        process.exit(0);
      })
    }
    process.on('SIGINT', shutdown);  // SIGINT -> Interrupt signal(Ctrl + C)
    process.on('SIGTERM', shutdown);  // SIGTERM ->  "Termination signal" (SENT BY docker, aws)
  } catch (error ) {
    logger.error("failed to start server", error);
    process.exit(1);
  }
}

bootstrap();