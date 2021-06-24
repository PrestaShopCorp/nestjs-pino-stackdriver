import { contextConfig } from './context.config';
import { LoggerConfigType, PredefinedConfig } from '../../../../src';

export const loggerConfig = {
  base: PredefinedConfig.STACKDRIVER,
  context: contextConfig,
} as LoggerConfigType;
