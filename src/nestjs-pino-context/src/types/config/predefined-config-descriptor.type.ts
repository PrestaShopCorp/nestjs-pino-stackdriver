import * as configs from '../../config';

type PredefinedConfigs = typeof configs;
export type PredefinedConfigDescriptorType = Extract<
  PredefinedConfigs,
  keyof PredefinedConfigs
>;
