import { isEmpty } from 'lodash';
import { INestApplication } from '@nestjs/common';
import {
  ConfigType,
  createLoggerTool,
  isNestApplication,
  ModuleRegisterType,
  PredefinedConfig,
} from '..';

export const createStackdriverLoggerConfig: (
  config: ConfigType,
) => ModuleRegisterType = (config: ConfigType) =>
  isEmpty(config)
    ? PredefinedConfig.STACKDRIVER
    : {
        ...config,
        base: PredefinedConfig.STACKDRIVER,
      };
export const createStackdriverLoggerTool = (
  configOrApp: INestApplication | ConfigType = {} as ConfigType,
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
