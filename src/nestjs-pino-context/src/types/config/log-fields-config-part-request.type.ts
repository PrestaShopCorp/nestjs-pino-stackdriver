import { PickFromRequestType } from '../../../../nestjs-ps-tools';
import { LogFieldsConfigPartType } from './log-fields-config-part.type';
import { RequestFilterType } from '..';

export type LogFieldsConfigPartRequestType = LogFieldsConfigPartType & {
  pick: PickFromRequestType;
  filter?: RequestFilterType;
};
