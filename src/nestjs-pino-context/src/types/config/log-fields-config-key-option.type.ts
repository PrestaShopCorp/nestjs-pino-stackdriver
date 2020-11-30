import { LogFieldsConfigKey } from '../../enums';

const ContextKeyOptions = Object.values(LogFieldsConfigKey);
export type LogFieldsConfigKeyOptionType = typeof ContextKeyOptions[number];
