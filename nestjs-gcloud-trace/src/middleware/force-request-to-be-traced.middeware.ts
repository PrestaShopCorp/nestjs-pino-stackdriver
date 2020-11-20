import { GcloudTraceService } from '../services';
import { RequestType } from '../types/request.type';
import { InternalServerErrorException } from '@nestjs/common';

export const forceRequestToBeTracedMiddleware = (
  gcloudTracer: GcloudTraceService,
  filterRequests: (req: RequestType, res: any) => boolean = () => true,
) => (req: RequestType, res: any, next: () => void) => {
  if (!gcloudTracer.isActive()) {
    throw new InternalServerErrorException(
      `You must call GcloudTracerService::start from your main application`,
    );
  }
  if (filterRequests(req, res)) {
    gcloudTracer.forceRequestToBeTraced(req);
  }
  next();
};
