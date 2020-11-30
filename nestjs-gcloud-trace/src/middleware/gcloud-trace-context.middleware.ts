import { InternalServerErrorException } from '@nestjs/common';
import { Context } from '../../../nestjs-context';
import { GcloudTraceService } from '../services';
import { CONTEXT_GCLOUD_TRACE } from '../constants';
import { RequestType } from '../types/request.type';

type ResponseType = {
  set: (key: string, value: any) => void;
} & any;

type CorrelationTracerMiddlewareArguments = {
  gcloudTracerService: GcloudTraceService;
  contextService: Context;
};

export const gcloudTraceContextMiddleware: (
  args: CorrelationTracerMiddlewareArguments,
) => (
  req: RequestType,
  res: ResponseType,
  next: () => void,
) => Promise<void> = ({
  gcloudTracerService,
  contextService,
}: CorrelationTracerMiddlewareArguments) => {
  return async (req: RequestType, res: ResponseType, next: () => void) => {
    if (!gcloudTracerService.isActive()) {
      throw new InternalServerErrorException(
        `You must call GcloudTracerService::start from your main application`,
      );
    }
    const contextId = gcloudTracerService.get().getCurrentContextId();
    if (contextId && contextService) {
      const traceUrl = await gcloudTracerService.getTraceUrl();
      if (traceUrl) {
        contextService.set(CONTEXT_GCLOUD_TRACE, traceUrl);
      }
    }
    next();
  };
};
