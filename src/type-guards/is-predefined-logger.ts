import { ModuleRegisterType, PredefinedConfigDescriptorType } from '../types';
import * as configs from '../config';

export const isPredefinedLogger = (
  logger: ModuleRegisterType,
): logger is PredefinedConfigDescriptorType => {
  return (
    typeof (logger as PredefinedConfigDescriptorType) === 'string' &&
    !!logger &&
    configs[logger as PredefinedConfigDescriptorType]
  );
};
