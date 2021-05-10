import { LoggerOptions } from 'pino';
import { ConfigType as ContextConfigType } from 'nestjs-context';
import { PredefinedConfig } from '../enums';

export type ConfigType = {
  base?: PredefinedConfig;
  context?: ContextConfigType;
  loggerOptions?: LoggerOptions;
  logFieldNames?: {
    context?: string;
    labels?: string;
    trace?: string;
  };
};
