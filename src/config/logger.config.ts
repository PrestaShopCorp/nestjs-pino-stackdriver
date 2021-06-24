import { merge } from 'lodash';
import * as configs from './predefined-logger';
import {
  LoggerConfigType,
  ModuleRegisterType,
  PredefinedConfigDescriptorType,
} from '../types';
import { isPredefinedLogger, isCustomLogger } from '../type-guards';
import { loggerContextConfig } from './logger-context.config';

const defaultLogFieldNames = {
  context: 'context',
  labels: 'labels',
  trace: 'trace',
};

export class LoggerConfig implements LoggerConfigType {
  context = loggerContextConfig;
  labels = {} as Record<string, string>;
  loggerOptions = {};
  logFieldNames = defaultLogFieldNames;

  constructor(config: ModuleRegisterType = {}) {
    let configToMerge: LoggerConfigType = {};
    if (isPredefinedLogger(config)) {
      configToMerge = configs[config];
    } else if (isCustomLogger(config)) {
      const defaultValues = config.base
        ? configs[config.base as PredefinedConfigDescriptorType]
        : ({} as LoggerConfigType);
      configToMerge = merge(defaultValues, config);
    }
    merge(this, configToMerge);
  }

  getFieldNameContext() {
    return this.logFieldNames.context;
  }
  getFieldNameLabels() {
    return this.logFieldNames.labels;
  }
  getFieldNameTrace() {
    return this.logFieldNames.trace;
  }
}
