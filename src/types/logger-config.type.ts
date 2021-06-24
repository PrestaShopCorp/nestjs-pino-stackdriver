import { LoggerOptions } from 'pino';
import { ContextConfigType } from 'nestjs-context';
import { PredefinedConfig } from '../enums';

export type LoggerConfigType = {
  base?: PredefinedConfig;
  context?: ContextConfigType;
  labels?: Record<string, string>;
  loggerOptions?: LoggerOptions;
  logFieldNames?: {
    context?: string;
    labels?: string;
    trace?: string;
  };
};
