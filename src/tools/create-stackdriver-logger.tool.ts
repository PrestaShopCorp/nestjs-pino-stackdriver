import { isEmpty } from 'lodash';
import { INestApplication } from '@nestjs/common';
import {
  LoggerConfigType,
  createLoggerTool,
  isNestApplication,
  ModuleRegisterType,
  PredefinedConfig,
} from '..';

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
  configOrApp: INestApplication | LoggerConfigType = {} as LoggerConfigType,
  contextName?: string,
) => {
  if (!isNestApplication(configOrApp)) {
    return createLoggerTool(
      createStackdriverLoggerConfig(configOrApp),
      contextName,
    );
  }
  return createLoggerTool(configOrApp, contextName);
};
