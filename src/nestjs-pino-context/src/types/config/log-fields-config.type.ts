import { LogFieldsConfigPartContextType } from './log-fields-config-part-context.type';
import { LogFieldsConfigPartRequestType } from './log-fields-config-part-request.type';
import { LogFieldsConfigPartEnvType } from './log-fields-config-part-env.type';

export type LogFieldsConfigType = {
  env?: LogFieldsConfigPartEnvType[];
  context?: LogFieldsConfigPartContextType[];
  request?: LogFieldsConfigPartRequestType[];
};
