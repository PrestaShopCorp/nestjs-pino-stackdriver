import * as path from 'path';
import { INestApplication } from '@nestjs/common';
import { Context } from 'nestjs-context';
import { Logger } from '../services';
import { LoggerConfig } from '../config';
import { ModuleRegisterType } from '../types';
import { isNestApplication } from '../type-guards';

export const createLoggerTool: (
  configOrApp: INestApplication | ModuleRegisterType,
  contextName?: string,
) => Logger = (
  configOrApp: INestApplication | ModuleRegisterType = {} as ModuleRegisterType,
  contextName = process.argv[1]
    ? path.basename(process.argv[1], path.extname(process.argv[1]))
    : path.basename(__filename),
) => {
  let logger;
  try {
    let config, context;
    if (isNestApplication(configOrApp)) {
      config = configOrApp.get(LoggerConfig);
      context = configOrApp.get(Context);
    } else {
      const config = new LoggerConfig(configOrApp);
      context = new Context(config.context);
    }
    logger = new Logger(config, context);
    logger.setContext(contextName);
    logger.debug(
      `Created ${
        Logger.name
      } with context ${contextName} and config ${JSON.stringify(config)}`,
    );
  } catch (e) {
    logger = new Logger();
    logger.setContext(contextName);
    logger.warn(
      `Could not create ${
        Logger.name
      } into the given context. Reason: ${e.toString()}`,
    );
  }
  logger.setContext(contextName);
  return logger;
};
