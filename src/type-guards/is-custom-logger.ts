import { LoggerConfigType, ModuleRegisterType } from '../types';

export const isCustomLogger = (
  logger: ModuleRegisterType,
): logger is LoggerConfigType => {
  return typeof (logger as LoggerConfigType) !== 'string';
};
