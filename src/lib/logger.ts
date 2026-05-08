import winston from 'winston';


export const logger = winston.createLogger({
  level : "info", 
  format : winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports : [
    new winston.transports.Console({
      format : winston.format.combine(
     winston.format.colorize(),
        winston.format.simple()
    )
    }),
    // In production, you might add file transports or send logs to Datadog/AWS CloudWatch here
  ]
    
}) 