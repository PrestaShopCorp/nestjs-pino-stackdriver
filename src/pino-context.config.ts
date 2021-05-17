import { merge } from 'lodash';
import * as configs from './config';
import {
  ConfigType,
  ModuleRegisterType,
  PredefinedConfigDescriptorType,
} from './types';
import { isPredefinedLogger, isCustomLogger } from './type-guards';
import { ContextName, addContextDefaults } from 'nestjs-context';

const defaultLogFieldNames = {
  context: 'context',
  labels: 'labels',
  trace: 'trace',
};

export class PinoContextConfig implements ConfigType {
  context = addContextDefaults({ type: ContextName.HTTP });
  loggerOptions = {};
  logFieldNames = defaultLogFieldNames;

  constructor(config: ModuleRegisterType = {}) {
    let configToMerge: ConfigType = {};
    if (isPredefinedLogger(config)) {
      configToMerge = configs[config];
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
