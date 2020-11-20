import { has } from 'lodash';
import { DeepRequired } from 'ts-essentials';
import { ConfigType } from '../types';

export const hasConfiguration = (
  config: ConfigType,
  key: keyof ConfigType | string | (keyof ConfigType | string)[],
): config is DeepRequired<ConfigType> => {
  return has(config, key);
};
