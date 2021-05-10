import { ConfigType, ModuleRegisterType } from '../types';

export const isCustomLogger = (
  logger: ModuleRegisterType,
): logger is ConfigType => {
  return typeof (logger as ConfigType) !== 'string';
};
