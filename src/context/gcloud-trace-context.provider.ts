import { Injectable, Optional } from '@nestjs/common';
import { IContextPropertyProvider } from 'nestjs-context';
import { GcloudTraceService } from '../services';

@Injectable()
export class GcloudTraceContextProvider implements IContextPropertyProvider {
  constructor(@Optional() private readonly tracer: GcloudTraceService) {}
  get() {
    return this.tracer?.getTraceUrlFromEnv();
  }
}
