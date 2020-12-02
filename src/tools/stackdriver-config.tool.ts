import { isEmpty } from 'lodash';
import {
  ConfigType,
  ModuleRegisterType,
  PredefinedConfig,
} from '../nestjs-pino-context';

export const stackdriverConfigTool: (
  config: ConfigType,
) => ModuleRegisterType = (config: ConfigType) =>
  isEmpty(config)
    ? PredefinedConfig.STACKDRIVER
    : {
        ...config,
        base: PredefinedConfig.STACKDRIVER,
      };
