import { has } from 'lodash';
import { DeepRequired } from 'ts-essentials';
import { ConfigType } from '../types';

type ConfigKey = keyof ConfigType | string | (keyof ConfigType | string)[];
export const hasConfiguration: (
  config: ConfigType,
  key: ConfigKey,
) => boolean = (
  config: ConfigType,
  key: ConfigKey,
): config is DeepRequired<ConfigType> => {
  return has(config, key);
};
