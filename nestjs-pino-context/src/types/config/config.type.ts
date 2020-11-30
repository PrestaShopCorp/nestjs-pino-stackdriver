import { LoggerOptions } from 'pino';
import { LogFieldsConfigType } from './log-fields-config.type';
import { PredefinedConfigOptionType } from './predefined-config-option.type';
import { LogFieldsConfigKey } from '../../enums';

export type ConfigType = {
  base?: PredefinedConfigOptionType;
  loggerOptions?: LoggerOptions;
  [LogFieldsConfigKey.FIELDS]?: LogFieldsConfigType;
  [LogFieldsConfigKey.LABELS]?: LogFieldsConfigType;
  logFieldNames?: {
    context?: string;
    labels?: string;
    trace?: string;
  };
};
