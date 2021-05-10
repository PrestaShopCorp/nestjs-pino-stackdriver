import * as path from 'path';
import { INestApplication } from '@nestjs/common';
import { Context } from 'nestjs-context';
import { PinoContextLogger } from '../services';
import { PinoContextConfig } from '../pino-context.config';
import { ModuleRegisterType } from '../types';
import { isNestApplication } from '../type-guards';

export const createLoggerTool: (
  configOrApp: INestApplication | ModuleRegisterType,
  contextName?: string,
) => PinoContextLogger = (
  configOrApp: INestApplication | ModuleRegisterType = {} as ModuleRegisterType,
  contextName = process.argv[1]
    ? path.basename(process.argv[1], path.extname(process.argv[1]))
    : path.basename(__filename),
) => {
  let logger;
  try {
    let config, context;
    if (isNestApplication(configOrApp)) {
      config = configOrApp.get(PinoContextConfig);
      context = configOrApp.get(Context);
    } else {
      config = new PinoContextConfig(configOrApp);
      context = new Context(config.context);
    }
    logger = new PinoContextLogger(context, config);
    logger.debug(
      `Created ${
        PinoContextLogger.name
      } with context ${contextName} and config ${JSON.stringify(config)}`,
    );
  } catch (e) {
    logger = new PinoContextLogger();
    logger.warn(
      `Could not create ${
        PinoContextLogger.name
      } into the given context. Reason: ${e.toString()}`,
    );
  }
  logger.setContext(contextName);
  return logger;
};
