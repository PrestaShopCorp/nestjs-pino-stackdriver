import { isEmpty } from 'lodash';
import {
  LoggerConfigType,
  createLoggerTool,
  isNestApplication,
  ModuleRegisterType,
  PredefinedConfig,
} from '..';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

export const createStackdriverLoggerConfig: (
  config: LoggerConfigType,
) => ModuleRegisterType = (config: LoggerConfigType) =>
  isEmpty(config)
    ? PredefinedConfig.STACKDRIVER
    : ({
        ...config,
        base: PredefinedConfig.STACKDRIVER,
      } as LoggerConfigType);

export const createStackdriverLoggerTool = (
  configOrApp:
    | INestApplicationContext
    | LoggerConfigType = {} as LoggerConfigType,
  contextName?: string,
) => {
  if (isNestApplication(configOrApp)) {
    return createLoggerTool(configOrApp, contextName);
  }

  return createLoggerTool(
    createStackdriverLoggerConfig(configOrApp),
    contextName,
  );
};
