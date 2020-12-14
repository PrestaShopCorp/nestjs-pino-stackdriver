import {
  ConfigType,
  createLoggerTool,
  isNestApplication,
} from '../nestjs-pino-context';
import { stackdriverConfigTool } from './stackdriver-config.tool';
import { INestApplication } from '@nestjs/common';

export const createStackdriverLoggerTool = (
  configOrApp: INestApplication | ConfigType = {} as ConfigType,
  contextName?: string,
) => {
  if (!isNestApplication(configOrApp)) {
    return createLoggerTool(stackdriverConfigTool(configOrApp), contextName);
  }
  return createLoggerTool(configOrApp, contextName);
};
