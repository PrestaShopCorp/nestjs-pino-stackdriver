import { INestApplication, Logger } from '@nestjs/common';
import * as path from 'path';
import { PinoContextLogger } from '../pino-context-logger.service';
import { PinoContextConfig } from '../pino-context.config';
import { Context } from '../../../nestjs-context';

export const createLoggerTool: (
  app: INestApplication,
  contextName?: string,
) => PinoContextLogger | Logger = (
  app: INestApplication,
  contextName = process.argv[1]
    ? path.basename(process.argv[1], path.extname(process.argv[1]))
    : path.basename(__filename),
) => {
  let logger;
  try {
    const config = app.get(PinoContextConfig);
    logger = new PinoContextLogger(
      app.get(PinoContextConfig),
      app.get(Context),
    );
    logger.debug(
      `Created ${
        PinoContextLogger.name
      } with context ${contextName} and config ${JSON.stringify(config)}`,
    );
  } catch (e) {
    logger = new Logger();
    logger.warn(
      `Could not create ${PinoContextLogger.name}. Reason: ${e.toString()}`,
    );
  }
  logger.setContext(contextName);
  return logger;
};
