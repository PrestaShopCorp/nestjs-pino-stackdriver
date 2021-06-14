import { ContextConfigType, ContextName } from 'nestjs-context';
import { CONTEXT_GCLOUD_TRACE } from '../constants';
import { GcloudTraceContextProvider } from '../context';

export const loggerContextConfig = {
  global: true,
  cached: true,
  addDefaults: true,
  type: ContextName.HTTP,
  build: {
    [CONTEXT_GCLOUD_TRACE]: [GcloudTraceContextProvider],
  },
  providers: [GcloudTraceContextProvider],
} as ContextConfigType;
