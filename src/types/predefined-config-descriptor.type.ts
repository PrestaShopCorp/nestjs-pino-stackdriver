import * as configs from '../config/predefined-logger';

type PredefinedConfigs = typeof configs;
export type PredefinedConfigDescriptorType = Extract<
  PredefinedConfigs,
  keyof PredefinedConfigs
>;
