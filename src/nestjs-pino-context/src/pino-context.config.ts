import { merge } from 'lodash';
import * as configs from './config';
import {
  ConfigType,
  ModuleRegisterType,
  PredefinedConfigDescriptorType,
  LogFieldsConfigType,
  LogFieldsConfigPartContextType,
} from './types';
import { isPredefinedLogger, isCustomLogger } from './type-guards';
import { LogFieldsConfigKey } from './enums';

const defaultLogFieldNames = {
  context: 'context',
  labels: 'labels',
  trace: 'trace',
};

export class PinoContextConfig implements ConfigType {
  [LogFieldsConfigKey.FIELDS]: Required<LogFieldsConfigType> = {
    env: [],
    request: [],
    // if nestjs-gcloud-trace module is being imported, the trace will be added as field
    context: [
      'logging.googleapis.com/trace',
    ] as LogFieldsConfigPartContextType[],
  };
  [LogFieldsConfigKey.LABELS]: Required<LogFieldsConfigType> = {
    env: [],
    request: [],
    // if nestjs-correlation-id module is being imported, the x-correlation-id will be added as label
    context: ['x-correlation-id'] as LogFieldsConfigPartContextType[],
  };
  loggerOptions = {};
  logFieldNames = defaultLogFieldNames;

  constructor(config: ModuleRegisterType = {}) {
    let configToMerge: ConfigType = {};
    if (isPredefinedLogger(config)) {
      configToMerge = configs[config] as ConfigType;
    } else if (isCustomLogger(config)) {
      const defaultValues = config.base
        ? configs[config.base as PredefinedConfigDescriptorType]
        : ({} as ConfigType);
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
