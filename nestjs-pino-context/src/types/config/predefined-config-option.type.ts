import { PredefinedConfig } from '../../enums';

const PredefinedConfigsOptions = Object.values(PredefinedConfig);
export type PredefinedConfigOptionType = typeof PredefinedConfigsOptions[number];
