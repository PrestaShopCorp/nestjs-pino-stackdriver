import { v4 } from 'uuid';
import * as path from 'path';
import { Context, RequestType } from 'nestjs-context';
import { Logger } from '../services';
import { LoggerConfig } from '../config';
import { ModuleRegisterType } from '../types';
import { isNestApplication } from '../type-guards';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

export const createLoggerTool: (
  configOrApp: INestApplicationContext | ModuleRegisterType,
  contextName?: string,
) => Logger = (
  configOrApp:
    | INestApplicationContext
    | ModuleRegisterType = {} as ModuleRegisterType,
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
      config = new LoggerConfig(configOrApp);
      context = new Context(
        `System-Logger-${v4()}`,
        config?.context || {},
        {} as RequestType,
      );
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
      `Could not create ${Logger.name} into the given context. Reason: ${e}`,
    );
  }
  logger.setContext(contextName);
  return logger;
};
